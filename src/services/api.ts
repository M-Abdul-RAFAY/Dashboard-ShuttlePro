import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import config from "../config";

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: config.api.baseUrl,
      timeout: config.api.timeout,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        // Add auth token to requests
        const token = localStorage.getItem(config.auth.tokenKey);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add timestamp to prevent caching
        config.headers["X-Request-Time"] = Date.now().toString();

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 errors (unauthorized)
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem(
              config.auth.refreshTokenKey
            );
            if (refreshToken) {
              const response = await this.post("/auth/refresh", {
                refreshToken,
              });

              const { accessToken } = response.data;
              localStorage.setItem(config.auth.tokenKey, accessToken);

              // Retry original request with new token
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            localStorage.removeItem(config.auth.tokenKey);
            localStorage.removeItem(config.auth.refreshTokenKey);
            window.location.href = "/login";
            return Promise.reject(refreshError);
          }
        }

        // Handle network errors
        if (error.code === "NETWORK_ERROR") {
          throw new Error("Network error. Please check your connection.");
        }

        // Handle timeout errors
        if (error.code === "ECONNABORTED") {
          throw new Error("Request timeout. Please try again.");
        }

        return Promise.reject(error);
      }
    );
  }

  // Generic request method
  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api.request<T>(config);
      return response.data;
    } catch (error: unknown) {
      throw this.handleError(error);
    }
  }

  // HTTP methods
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: "GET", url });
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>({ ...config, method: "POST", url, data });
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>({ ...config, method: "PUT", url, data });
  }

  async patch<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.request<T>({ ...config, method: "PATCH", url, data });
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({ ...config, method: "DELETE", url });
  }

  // File upload method
  async upload<T>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    const formData = new FormData();
    formData.append("file", file);

    return this.request<T>({
      method: "POST",
      url,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(progress);
        }
      },
    });
  }

  // Download file method
  async download(url: string, filename?: string): Promise<void> {
    try {
      const response = await this.api.get(url, {
        responseType: "blob",
      });

      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Error handling
  private handleError(error: unknown): Error {
    if (error && typeof error === "object" && "response" in error) {
      // Server responded with error status
      const response = (
        error as { response: { status: number; data?: { message?: string } } }
      ).response;
      const { status, data } = response;

      if (data?.message) {
        return new Error(data.message);
      }

      switch (status) {
        case 400:
          return new Error("Bad request. Please check your input.");
        case 401:
          return new Error("Unauthorized. Please login again.");
        case 403:
          return new Error("Access denied. You do not have permission.");
        case 404:
          return new Error("Resource not found.");
        case 422:
          return new Error("Validation error. Please check your input.");
        case 500:
          return new Error("Server error. Please try again later.");
        default:
          return new Error(`Request failed with status ${status}`);
      }
    } else if (error && typeof error === "object" && "request" in error) {
      // Request was made but no response received
      return new Error(
        "No response from server. Please check your connection."
      );
    } else {
      // Something else happened
      const message =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";
      return new Error(message);
    }
  }

  // Set auth token
  setAuthToken(token: string) {
    localStorage.setItem(config.auth.tokenKey, token);
  }

  // Remove auth token
  removeAuthToken() {
    localStorage.removeItem(config.auth.tokenKey);
    localStorage.removeItem(config.auth.refreshTokenKey);
  }

  // Get current auth token
  getAuthToken(): string | null {
    return localStorage.getItem(config.auth.tokenKey);
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;
