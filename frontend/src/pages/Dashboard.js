import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    fetch("http://localhost:5000/api/visitors")
      .then((res) => res.json())
      .then((data) => setVisitors(data))
      .catch((err) => console.log("Error:", err));
  }, []);

  const filteredVisitors = visitors.filter((v) => {
    const str = `${v.name} ${v.company} ${v.purpose}`.toLowerCase();
    const m1 = str.includes(search.toLowerCase());
    const m2 = filterType === "All" || v.visitorType === filterType;
    const m3 = filterStatus === "All" || v.status === filterStatus;
    return m1 && m2 && m3;
  });

  const openDoc = (path) => {
    if (!path) return;
    window.open(`http://localhost:5000/uploads/${path}`, "_blank");
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <img src="/logo.png" alt="logo" style={styles.logo} />
        <h1 style={styles.headerTitle}>Admin Dashboard</h1>
        <button style={styles.logoutBtn} onClick={() => navigate("/login")}>
          Logout
        </button>
      </header>

      {/* Stats Row */}
      <div style={styles.statsRow}>
        <div style={styles.statBox}>
          <h3>Total Visitors</h3>
          <p>{visitors.length}</p>
        </div>

        <div style={styles.statBox}>
          <h3>Inside</h3>
          <p>{visitors.filter((v) => v.status === "Inside").length}</p>
        </div>

        <div style={styles.statBox}>
          <h3>Checked-out</h3>
          <p>{visitors.filter((v) => v.status === "Checked-out").length}</p>
        </div>
      </div>

      {/* Search + Filters */}
      <div style={styles.filterRow}>
        <input
          style={styles.search}
          placeholder="Search name, company, purpose..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={styles.select}
        >
          <option>All</option>
          <option>Visitor</option>
          <option>Vendor</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={styles.select}
        >
          <option>All</option>
          <option>Inside</option>
          <option>Checked-out</option>
        </select>
      </div>

      {/* TABLE */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Type</th>
              <th>Name</th>
              <th>Company</th>
              <th>Purpose</th>
              <th>Check-in</th>
              <th>Status</th>
              <th>Vendor Docs</th>
              <th>Pass</th>
            </tr>
          </thead>

          <tbody>
            {filteredVisitors.map((v) => (
              <tr key={v._id}>
                <td>{v.visitorType}</td>
                <td>{v.name}</td>
                <td>{v.company}</td>
                <td>{v.purpose}</td>
                <td>{new Date(v.createdAt).toLocaleString()}</td>

                <td>
                  {v.status === "Inside" ? (
                    <span style={styles.insideBadge}>Inside</span>
                  ) : (
                    <span style={styles.outBadge}>Checked-out</span>
                  )}
                </td>

                {/* Vendor Docs */}
                <td>
                  {v.visitorType === "Vendor" ? (
                    <div style={styles.docBtns}>
                      {v.esiFile && (
                        <button onClick={() => openDoc(v.esiFile)} style={styles.docBtn}>ESI</button>
                      )}
                      {v.pfFile && (
                        <button onClick={() => openDoc(v.pfFile)} style={styles.docBtn}>PF</button>
                      )}
                      {v.wcFile && (
                        <button onClick={() => openDoc(v.wcFile)} style={styles.docBtn}>WC</button>
                      )}
                      {v.insuranceFile && (
                        <button onClick={() => openDoc(v.insuranceFile)} style={styles.docBtn}>Insurance</button>
                      )}
                      {v.agreementFile && (
                        <button onClick={() => openDoc(v.agreementFile)} style={styles.docBtn}>WO/PO</button>
                      )}
                    </div>
                  ) : (
                    "-"
                  )}
                </td>

                {/* PASS */}
                <td>
                  <button
                    style={styles.passBtn}
                    onClick={() => navigate(`/pass/${v._id}`)}
                  >
                    View Pass
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/************ STYLES ************/
const styles = {
  page: {
    background: "#f5f7fc",
    minHeight: "100vh",
  },
  header: {
    background: "linear-gradient(135deg, #0d1b3d, #1f3b73)",
    padding: "20px 40px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    color: "white",
    borderRadius: "0 0 25px 25px",
  },
  logo: { height: "70px" },
  headerTitle: { flex: 1, fontSize: "26px", fontWeight: "700" },
  logoutBtn: {
    background: "#f4d07f",
    color: "#0d1b3d",
    padding: "10px 18px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  statsRow: {
    display: "flex",
    gap: "20px",
    padding: "20px 40px",
  },
  statBox: {
    flex: 1,
    background: "white",
    borderRadius: "15px",
    padding: "20px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  filterRow: {
    padding: "0 40px",
    marginTop: "10px",
    display: "flex",
    gap: "15px",
  },
  search: {
    flex: 1,
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ccc",
  },
  select: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ccc",
  },
  tableWrapper: {
    margin: "20px 40px",
    background: "white",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.1)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  insideBadge: {
    background: "#d4edda",
    padding: "5px 10px",
    borderRadius: "6px",
  },
  outBadge: {
    background: "#f8d7da",
    padding: "5px 10px",
    borderRadius: "6px",
  },
  docBtns: { display: "flex", gap: "6px", flexWrap: "wrap" },
  docBtn: {
    background: "#0d1b3d",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  passBtn: {
    background: "#0d6efd",
    color: "white",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    border: "none",
  }
};

export default Dashboard;
