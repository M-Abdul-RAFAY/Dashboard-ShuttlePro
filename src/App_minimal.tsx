import React from "react";

function App() {
  return (
    <div style={{ padding: "20px", fontSize: "24px" }}>
      <h1>🚀 Ginkgo Retail System</h1>
      <p>Application is running successfully!</p>
      <p>Current time: {new Date().toLocaleString()}</p>
      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#e3f2fd",
          borderRadius: "8px",
        }}
      >
        <h2>Dashboard Links:</h2>
        <ul>
          <li>
            <a href="/dashboard">Main Dashboard</a>
          </li>
          <li>
            <a href="/ginkgo-dashboard">Ginkgo Retail Dashboard</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default App;
