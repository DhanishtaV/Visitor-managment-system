import React, { useState } from "react";
import axios from "axios";

export default function AddSecurityUser() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5001/admin/create-security", data);
      alert("Security user created!");
    } catch (err) {
      alert("Error creating user");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Security User</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
