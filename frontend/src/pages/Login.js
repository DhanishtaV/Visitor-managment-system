import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Login failed:", data.message);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      if (data.role === "admin") navigate("/admin");
      else navigate("/security");
    } catch (err) {
      console.error("Server error:", err);
    }
  };

  return (
    <div style={styles.page}>
      {/* Top corporate band */}
      <div style={styles.topBand} />

      {/* Login Card */}
      <div style={styles.card}>
        <img src="/thejo-logo.png" alt="THEJO" style={styles.logo} />

        <h1 style={styles.title}>Secure Login</h1>
        <p style={styles.subtitle}>Authorized personnel access only</p>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleLogin} style={styles.button}>
          Login
        </button>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#F6F3EE", // beige background
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    fontFamily: "Inter, system-ui, sans-serif",
  },

  topBand: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "160px",
    background: "linear-gradient(135deg, #0F2A44, #123C6A)",
  },

  card: {
    background: "rgba(255,255,255,0.96)",
    width: "420px",
    padding: "42px 36px",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow: "0 40px 80px rgba(15,23,42,0.25)",
    zIndex: 1,
  },

  logo: {
    height: "48px",
    marginBottom: "24px",
  },

  title: {
    fontSize: "26px",
    fontWeight: "800",
    marginBottom: "6px",
    color: "#0F172A",
  },

  subtitle: {
    fontSize: "14px",
    color: "#64748B",
    marginBottom: "26px",
  },

  input: {
    width: "100%",
    padding: "14px 16px",
    marginBottom: "16px",
    borderRadius: "10px",
    border: "1px solid #CBD5E1",
    fontSize: "14px",
    outline: "none",
  },

  button: {
    width: "100%",
    padding: "14px",
    borderRadius: "999px",
    border: "none",
    background: "linear-gradient(135deg, #F4B740, #F7C55A)",
    color: "#0F172A",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "10px",
    boxShadow: "0 12px 30px rgba(244,183,64,0.45)",
  },
};

export default Login;
