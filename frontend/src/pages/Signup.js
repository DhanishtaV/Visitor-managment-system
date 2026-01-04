import { useState } from "react";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5001/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Admin registered successfully! 🎉");
        setFormData({ name: "", email: "", password: "" });
      } else {
        setMessage(data.message || "Signup failed");
      }
    } catch (err) {
      setMessage("Server error — check backend");
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.box} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Admin Signup</h2>

        <input
          style={styles.input}
          name="name"
          placeholder="Admin Name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          style={styles.input}
          type="email"
          name="email"
          placeholder="Admin Email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          style={styles.input}
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        <button style={styles.button}>Sign Up</button>

        {message && <p style={styles.msg}>{message}</p>}
      </form>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f2f3f5",
  },
  box: {
    width: "350px",
    background: "white",
    padding: "25px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  title: {
    textAlign: "center",
    marginBottom: "10px",
  },
  input: {
    height: "38px",
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    height: "40px",
    background: "#007bff",
    color: "white",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
  },
  msg: {
    textAlign: "center",
    marginTop: "10px",
    color: "darkgreen",
  },
};

export default Signup;
