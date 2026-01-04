import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Admin() {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState([]);

  // Protect route: Only admin can view
  useEffect(() => {
    const isAdmin = localStorage.getItem("admin");
    if (!isAdmin) {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch visitor data
  useEffect(() => {
    fetch("http://localhost:5001/api/visitors")
      .then((res) => res.json())
      .then((data) => setVisitors(data))
      .catch(() => alert("Unable to load visitors"));
  }, []);

  // logout
  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/");
  };

  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <div style={{ textAlign: "right", marginBottom: 20 }}>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <h2>Visitor List</h2>

      {visitors.length === 0 ? (
        <p>No visitors have checked in yet.</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          style={{ width: "100%", marginTop: 20 }}
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Company</th>
              <th>Purpose</th>
              <th>Check-in Time</th>
            </tr>
          </thead>
          <tbody>
            {visitors.map((v) => (
              <tr key={v._id}>
                <td>{v.name}</td>
                <td>{v.phone}</td>
                <td>{v.company}</td>
                <td>{v.purpose}</td>
                <td>{new Date(v.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Admin;
