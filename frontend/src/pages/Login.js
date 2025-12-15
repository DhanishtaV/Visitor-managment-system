import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // Save login data
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        // Redirect based on role
        if (data.role === "admin") {
          navigate("/dashboard");                 // Admin Dashboard
        } else if (data.role === "security") {
          navigate("/security-dashboard");        // Security Dashboard
        } else {
          setMsg("Invalid user role");
        }
      } else {
        setMsg(data.message || "Login failed");
      }
    } catch (err) {
      console.log(err);
      setMsg("Server error");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
          />

          <button style={styles.button}>Login</button>
        </form>

        {msg && <p style={styles.msg}>{msg}</p>}
      </div>
    </div>
  );
}

// ------------------ STYLES ------------------ //

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#eef1f7",
  },
  card: {
    width: "350px",
    background: "white",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    fontSize: "22px",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#0d6efd",
    border: "none",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
  },
  msg: {
    marginTop: "10px",
    color: "red",
    textAlign: "center",
  },
};

export default Login;
