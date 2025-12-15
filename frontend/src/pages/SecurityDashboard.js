// frontend/src/pages/SecurityDashboard.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function SecurityDashboard() {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const role = localStorage.getItem("role") || "security";

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/visitors");
      const data = await res.json();
      setVisitors(data);
    } catch (err) {
      console.error(err);
    }
  };

  const checkoutVisitor = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/checkout/${id}`, {
        method: "PUT",
      });
      if (res.ok) fetchVisitors();
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  // analytics
  const total = visitors.length;
  const insideCount = visitors.filter((v) => v.status === "Inside").length;
  const checkedOut = visitors.filter((v) => v.status === "Checked-out").length;

  const filtered = visitors.filter((v) => {
    const txt = `${v.name} ${v.company} ${v.phone} ${v.purpose}`.toLowerCase();
    const matchesSearch = txt.includes(search.toLowerCase());
    const matchesType = filterType === "All" || v.visitorType === filterType;
    const matchesStatus = filterStatus === "All" || v.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div style={styles.page}>
      <header style={styles.hero}>
        <img src="/logo.png" alt="logo" style={styles.heroLogo} />
        <h1 style={styles.heroTitle}>Security Dashboard</h1>
        <button style={styles.logoutBtn} onClick={() => { localStorage.clear(); navigate("/login"); }}>
          Logout
        </button>
      </header>

      <main style={styles.container}>
        <div style={styles.cardsRow}>
          <div style={styles.cardStat}>
            <div style={styles.statLabel}>Total Visitors</div>
            <div style={styles.statValue}>{total}</div>
          </div>
          <div style={styles.cardStat}>
            <div style={styles.statLabel}>Inside</div>
            <div style={styles.statValue}>{insideCount}</div>
          </div>
          <div style={styles.cardStat}>
            <div style={styles.statLabel}>Checked-out</div>
            <div style={styles.statValue}>{checkedOut}</div>
          </div>
        </div>

        <div style={styles.controls}>
          <input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} style={styles.input} />
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={styles.select}>
            <option value="All">All Types</option>
            <option value="Visitor">Visitor</option>
            <option value="Vendor">Vendor</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={styles.select}>
            <option value="All">All Status</option>
            <option value="Inside">Inside</option>
            <option value="Checked-out">Checked-out</option>
          </select>
        </div>

        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Type</th>
                <th>Name</th>
                <th>Company</th>
                <th>Purpose</th>
                <th>Check-in</th>
                <th>Status</th>
                <th>Checkout</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="7" style={styles.noData}>No visitors</td></tr>
              ) : (
                filtered.map((v) => (
                  <tr key={v._id}>
                    <td>{v.visitorType}</td>
                    <td>{v.name}</td>
                    <td>{v.company}</td>
                    <td>{v.purpose}</td>
                    <td>{new Date(v.createdAt).toLocaleString()}</td>
                    <td>
                      <span style={v.status === "Inside" ? styles.badgeInside : styles.badgeOut}>
                        {v.status}
                      </span>
                    </td>
                    <td>
                      {/* Only security role sees checkout */}
                      {role === "security" && v.status === "Inside" ? (
                        <button style={styles.checkoutBtn} onClick={() => checkoutVisitor(v._id)}>
                          Checkout
                        </button>
                      ) : (
                        v.checkoutTime ? new Date(v.checkoutTime).toLocaleString() : "-"
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

/* STYLES (shared look with admin) */
const styles = {
  page: { minHeight: "100vh", background: "#f4f6fa" },

  hero: {
    width: "100%",
    background: "linear-gradient(135deg,#0d1b3d,#1f3b73)",
    padding: "28px 20px",
    color: "white",
    display: "flex",
    alignItems: "center",
    gap: 20,
    position: "relative",
  },
  heroLogo: { height: 70, marginLeft: 30 },
  heroTitle: { fontSize: 24, color: "#f4d07f", marginLeft: 12, fontWeight: 700 },
  logoutBtn: { position: "absolute", right: 20, top: 14, background: "#f4d07f", border: "none", padding: "8px 14px", borderRadius: 8, cursor: "pointer" },

  container: { width: "95%", maxWidth: 1200, margin: "-30px auto 60px" },

  cardsRow: { display: "flex", gap: 18, marginBottom: 20, flexWrap: "wrap" },
  cardStat: { flex: 1, minWidth: 180, background: "white", padding: 18, borderRadius: 12, boxShadow: "0 8px 22px rgba(0,0,0,0.06)" },
  statLabel: { color: "#6b7280", fontSize: 13, marginBottom: 6 },
  statValue: { fontSize: 28, fontWeight: 700, color: "#0d1b3d" },

  controls: { display: "flex", gap: 12, alignItems: "center", marginBottom: 14 },
  input: { flex: 1, padding: 10, borderRadius: 8, border: "1px solid #dbe6f0", background: "#fff" },
  select: { padding: 10, borderRadius: 8, border: "1px solid #dbe6f0", background: "#fff" },

  tableCard: { background: "white", borderRadius: 12, padding: 0, boxShadow: "0 10px 28px rgba(0,0,0,0.06)", overflow: "auto" },
  table: { width: "100%", borderCollapse: "collapse", minWidth: 900 },
  noData: { padding: 24, textAlign: "center", color: "#777" },

  badgeInside: { padding: "6px 10px", background: "#e6f7ec", borderRadius: 8, color: "#12411a", fontWeight: 600 },
  badgeOut: { padding: "6px 10px", background: "#fdecea", borderRadius: 8, color: "#7a1e1e", fontWeight: 600 },

  checkoutBtn: { background: "#0d1b3d", color: "white", padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer" },
};

/* small responsive tweaks */
if (typeof document !== "undefined") {
  const css = `
  @media (max-width: 820px) {
    .table-responsive { overflow-x: auto; }
  }
  @media (max-width: 640px) {
    .controls { flex-direction: column; gap: 10px; }
    .cardsRow { flex-direction: column; }
  }
  `;
  const s = document.createElement("style"); s.innerHTML = css; document.head.appendChild(s);
}

export default SecurityDashboard;
