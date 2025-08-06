import apiService from "../../services/api";
import { User } from "../../types";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}

interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>(
      "/auth/login",
      credentials
    );

    // Store tokens
    if (response.token) {
      localStorage.setItem("ginkgo_auth_token", response.token);
    }
    if (response.refreshToken) {
      localStorage.setItem("ginkgo_refresh_token", response.refreshToken);
    }

    return response;
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>(
      "/auth/register",
      userData
    );

    // Store tokens
    if (response.token) {
      localStorage.setItem("ginkgo_auth_token", response.token);
    }
    if (response.refreshToken) {
      localStorage.setItem("ginkgo_refresh_token", response.refreshToken);
    }

    return response;
  }

  async logout(): Promise<void> {
    try {
      await apiService.post("/auth/logout");
    } catch (error) {
      // Even if logout fails on server, clear local storage
      console.warn("Logout failed on server:", error);
    } finally {
      // Clear local storage
      localStorage.removeItem("ginkgo_auth_token");
      localStorage.removeItem("ginkgo_refresh_token");
      apiService.removeAuthToken();
    }
  }

  async getCurrentUser(): Promise<User> {
    return await apiService.get<User>("/auth/me");
  }

  async refreshToken(): Promise<{ token: string; user: User }> {
    const refreshToken = localStorage.getItem("ginkgo_refresh_token");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await apiService.post<{ token: string; user: User }>(
      "/auth/refresh",
      {
        refreshToken,
      }
    );

    // Update stored token
    localStorage.setItem("ginkgo_auth_token", response.token);

    return response;
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    return await apiService.post<{ message: string }>("/auth/forgot-password", {
      email,
    });
  }

  async resetPassword(
    token: string,
    password: string
  ): Promise<{ message: string }> {
    return await apiService.post<{ message: string }>("/auth/reset-password", {
      token,
      password,
    });
  }

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ message: string }> {
    return await apiService.post<{ message: string }>("/auth/change-password", {
      currentPassword,
      newPassword,
    });
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    return await apiService.patch<User>("/auth/profile", userData);
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    return await apiService.post<{ message: string }>("/auth/verify-email", {
      token,
    });
  }

  async resendVerification(): Promise<{ message: string }> {
    return await apiService.post<{ message: string }>(
      "/auth/resend-verification"
    );
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem("ginkgo_auth_token");
    return !!token;
  }

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem("ginkgo_auth_token");
  }

  // Check if token is expired
  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }
}

const authService = new AuthService();
export default authService;
