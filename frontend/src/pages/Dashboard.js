import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [activeType, setActiveType] = useState("Visitor");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(
  new Date().getFullYear()
);

  useEffect(() => {
    fetch("http://localhost:5001/api/visitors")
      .then((res) => res.json())
      .then((data) => setVisitors(data))
      .catch(() => {});
  }, []);

  const filteredVisitors = visitors.filter((v) => {
    const matchText = `${v.name} ${v.company} ${v.purpose}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchType =
      (filterType === "All" || v.visitorType === filterType) &&
      v.visitorType === activeType;

    const matchStatus = filterStatus === "All" || v.status === filterStatus;
   
    return matchText && matchType && matchStatus;
  });

  const openDoc = (path) => {
    if (!path) return;
    window.open(`http://localhost:5001/uploads/${path}`, "_blank");
  };

  const downloadReport = (type, yearParam) => {
  let from, to;

  const year = Number(yearParam);

  if (type === "yearly") {
    from = new Date(year, 0, 1).toISOString();
    to = new Date(year, 11, 31, 23, 59, 59).toISOString();
  }

  if (type === "daily") {
    const today = new Date();
    from = new Date(today.setHours(0, 0, 0, 0)).toISOString();
    to = new Date(today.setHours(23, 59, 59, 999)).toISOString();
  }

  if (type === "weekly") {
    const now = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(now.getDate() - 7);
    from = lastWeek.toISOString();
    to = now.toISOString();
  }

  if (type === "monthly") {
    const now = new Date();
    from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    to = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
      23,
      59,
      59
    ).toISOString();
  }

  window.open(
    `http://localhost:5001/api/visitors/report?from=${from}&to=${to}`,
    "_blank"
  );
};

  return (
    <div style={styles.canvas}>
      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <button
            style={styles.hamburger}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <img src="/thejo-logo.png" alt="logo" style={styles.logo} />
        </div>

        <div style={styles.headerActions}>
          <button style={styles.reportBtn} onClick={() => downloadReport("daily")}>
            Daily
          </button>
          <button style={styles.reportBtn} onClick={() => downloadReport("weekly")}>
            Weekly
          </button>
          <button style={styles.reportBtn} onClick={() => downloadReport("monthly")}>
            Monthly
          </button>
        <button
  style={styles.reportBtn}
  onClick={() => downloadReport("yearly", selectedYear)}
>
  Yearly
</button>

          <select
  value={selectedYear}
  onChange={(e) => setSelectedYear(e.target.value)}
  style={styles.select}
>
  <option value={2024}>2024</option>
  <option value={2025}>2025</option>
  <option value={2026}>2026</option>
</select>

<button
  style={styles.reportBtn}
  onClick={() => downloadReport("yearly", selectedYear)}
>
  Download Year Report
</button>

        </div>
      </header>

      {/* SIDEBAR OVERLAY */}
      {sidebarOpen && (
        <div
          style={styles.sidebarOverlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      {sidebarOpen && (
        <aside style={styles.sidebar}>
          <h3 style={styles.sidebarTitle}>THEJO</h3>

          {["Visitor", "Vendor", "Corporate"].map((type) => (
            <button
              key={type}
              style={{
                ...styles.sidebarItem,
                background: activeType === type ? "#E5E7EB" : "transparent",
                fontWeight: activeType === type ? "700" : "500",
              }}
              onClick={() => {
                setActiveType(type);
                setSidebarOpen(false);
              }}
            >
              {type === "Corporate" ? "Corporate Staff" : `${type}s`}
            </button>
          ))}

          <button
            style={styles.sidebarLogout}
            onClick={() => navigate("/login")}
          >
            Logout
          </button>
        </aside>
      )}

      {/* HERO */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Admin Dashboard</h1>
        <p style={styles.heroSubtitle}>
          Centralized overview of visitor access and movement
        </p>
      </section>

      {/* MAIN CONTENT */}
      <main style={styles.stage}>
        {/* STATS */}
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <p style={styles.statLabel}>Total</p>
            <h2 style={styles.statValue}>{filteredVisitors.length}</h2>
          </div>

          <div style={styles.statCard}>
            <p style={styles.statLabel}>Inside</p>
            <h2 style={styles.statValue}>
              {filteredVisitors.filter((v) => v.status === "Inside").length}
            </h2>
          </div>

          <div style={styles.statCard}>
            <p style={styles.statLabel}>Checked-out</p>
            <h2 style={styles.statValue}>
              {filteredVisitors.filter((v) => v.status === "Checked-out").length}
            </h2>
          </div>
        </div>

        {/* FILTERS */}
        <div style={styles.filterRow}>
          <input
            style={styles.search}
            placeholder="Search name, company, purpose..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            style={styles.select}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option>All</option>
            <option>Visitor</option>
            <option>Vendor</option>
          </select>

          <select
            style={styles.select}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option>All</option>
            <option>Inside</option>
            <option>Checked-out</option>
            <option>Pending</option>
          </select>
        </div>

        {/* TABLE */}
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                {[
                  "Photo",
                  "Name",
                  "Type",
                  "Company",
                  "Purpose",
                  "Whom to Meet",
                  "Check-in",
                  "Check-out",
                  "Status",
                  "Docs",
                  "Pass",
                ].map((h) => (
                  <th key={h} style={styles.th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredVisitors.map((v) => (
                <tr key={v._id}>
                  <td style={styles.td}>
                    {v.photo ? (
  <img
  src={v.photo}
  alt="visitor"
  style={styles.photo}
/>

) : (
  "--"
)}
                  </td>
                  <td style={styles.tdBold}>{v.name}</td>
                  <td style={styles.td}>{v.visitorType}</td>
                  <td style={styles.td}>{v.company}</td>
                  <td style={styles.td}>{v.purpose}</td>
                  <td style={styles.td}>{v.whomToMeet || "--"}</td>
                  <td style={styles.tdSmall}>
                    {v.checkinTime
                      ? new Date(v.checkinTime).toLocaleString()
                      : "--"}
                  </td>
                  <td style={styles.tdSmall}>
                    {v.checkoutTime
                      ? new Date(v.checkoutTime).toLocaleString()
                      : "--"}
                  </td>
                  <td style={styles.td}>{v.status}</td>
                  <td style={styles.td}>
                    {v.idProofFile ? (
                      <button
                        style={styles.docBtn}
                        onClick={() => openDoc(v.idProofFile)}
                      >
                        View
                      </button>
                    ) : (
                      "--"
                    )}
                  </td>
                  <td style={styles.td}>
                    <button
                      style={styles.passBtn}
                      onClick={() => navigate(`/pass/${v._id}`)}
                    >
                      Pass
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

/* ===================== STYLES ===================== */

const styles = {
  canvas: {
    minHeight: "100vh",
    background: "#F6F3EE",
    fontFamily: "Inter, system-ui, sans-serif",
  },

  header: {
    height: "64px",
    background: "#FFFFFF",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 32px",
    borderBottom: "1px solid #E5E7EB",
  },

  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  logo: { height: "44px" },

  hamburger: {
    fontSize: "22px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
  },

  headerActions: {
    display: "flex",
    gap: "10px",
  },

  reportBtn: {
    padding: "8px 16px",
    borderRadius: "6px",
    border: "1px solid #CBD5E1",
    background: "#FFFFFF",
    fontWeight: "600",
    cursor: "pointer",
  },

  sidebarOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.3)",
    zIndex: 999,
  },

  sidebar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "260px",
    height: "100vh",
    background: "#FFFFFF",
    padding: "24px",
    boxShadow: "4px 0 20px rgba(0,0,0,0.1)",
    zIndex: 1000,
  },

  sidebarTitle: {
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "20px",
  },

  sidebarItem: {
    width: "100%",
    padding: "12px 16px",
    textAlign: "left",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    borderRadius: "6px",
  },

  sidebarLogout: {
    marginTop: "30px",
    padding: "12px",
    background: "#FEE2E2",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },

  hero: {
    margin: "24px",
    padding: "28px",
    background: "#1E3A8A",
    color: "#FFFFFF",
    borderRadius: "12px",
  },

  heroTitle: {
    fontSize: "28px",
    marginBottom: "6px",
  },

  heroSubtitle: {
    opacity: 0.9,
  },

  stage: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "0 24px 40px",
  },

  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "24px",
    marginBottom: "24px",
  },

  statCard: {
    background: "#FFFFFF",
    padding: "24px",
    borderRadius: "12px",
  },

  statLabel: {
    fontSize: "13px",
    color: "#64748B",
  },

  statValue: {
    fontSize: "32px",
    fontWeight: "700",
  },

  filterRow: {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
  },

  search: {
    flex: 1,
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #CBD5E1",
  },

  select: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #CBD5E1",
  },

  tableWrapper: {
    background: "#FFFFFF",
    borderRadius: "12px",
    overflow: "hidden",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    padding: "14px",
    background: "#F1F5F9",
    textAlign: "left",
    fontSize: "13px",
    fontWeight: "700",
  },

  td: {
    padding: "14px",
    borderBottom: "1px solid #E5E7EB",
    fontSize: "14px",
  },

  tdBold: {
    padding: "14px",
    fontWeight: "600",
  },

  tdSmall: {
    padding: "14px",
    fontSize: "13px",
    color: "#475569",
  },

  photo: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
  },

  docBtn: {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "1px solid #CBD5E1",
    background: "#FFFFFF",
    cursor: "pointer",
  },

  passBtn: {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "none",
    background: "#1E3A8A",
    color: "#FFFFFF",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default Dashboard;
