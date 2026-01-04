import { useNavigate } from "react-router-dom";
import WebcamCapture from "../components/WebcamCapture";
import axios from "axios";
import { useEffect, useState, useCallback } from "react";

function SecurityDashboard() {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [passInputs, setPassInputs] = useState({});

  const token = localStorage.getItem("token");

  const fetchVisitors = useCallback(async () => {
    const res = await axios.get(
      "http://localhost:5001/api/security/today",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setVisitors(res.data);
  }, [token]);

  useEffect(() => {
    fetchVisitors();
  }, [fetchVisitors]);

  const isOverstayed = (v) => {
    if (v.status !== "Inside" || !v.checkinTime) return false;
    const diff =
      (new Date() - new Date(v.checkinTime)) / (1000 * 60 * 60);
    return diff >= 4;
  };

  const filteredVisitors = visitors.filter((v) =>
    `${v.name} ${v.company} ${v.purpose}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const confirmCheckIn = async () => {
    if (!photo) return alert("Capture photo first");
    const passId = passInputs[selectedVisitor._id];
    if (!passId) return alert("Pass ID missing");

    await axios.put(
      `http://localhost:5001/api/security/checkin/${selectedVisitor._id}/photo`,
      { photo, passId },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setSelectedVisitor(null);
    setPhoto(null);
    fetchVisitors();
  };

  const checkOut = async (id) => {
    await axios.put(
      `http://localhost:5001/api/security/checkout/${id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchVisitors();
  };

  const openDoc = (path) => {
    window.open(`http://localhost:5001/uploads/${path}`, "_blank");
  };

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.logoBox}>
          <img src="/thejo-logo.png" alt="logo" style={styles.logo} />
        </div>

        <button style={styles.logoutBtn} onClick={() => navigate("/login")}>
          Logout
        </button>
      </header>

      {/* PAGE HEADER */}
      <div style={styles.pageHeader}>
        <h1 style={styles.pageTitle}>Security Dashboard</h1>
        <p style={styles.pageSubtitle}>
          Monitor and manage todays visitor activities
        </p>
      </div>

      {/* STATS */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Total Visitors</p>
          <h2 style={styles.statValue}>{visitors.length}</h2>
        </div>

        <div style={styles.statCard}>
          <p style={styles.statLabel}>Checked In</p>
          <h2 style={styles.statValue}>
            {visitors.filter(v => v.status === "Inside").length}
          </h2>
        </div>

        <div style={styles.statCard}>
          <p style={styles.statLabel}>Pending</p>
          <h2 style={styles.statValue}>
            {visitors.filter(v => v.status === "Pending").length}
          </h2>
        </div>
      </div>

      {/* SEARCH */}
      <div style={styles.filterRow}>
        <input
          style={styles.search}
          placeholder="Search name, company, purpose..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              {[
                "Type",
                "Name",
                "Company",
                "Purpose",
                "Whom to Meet",
                "Check-in",
                "Check-out",
                "Status",
                "Documents",
                "Action",
                "Pass",
              ].map((h) => (
                <th key={h} style={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredVisitors.map((v, index) => (
              <tr key={v._id}>
                <td style={styles.td}>{v.visitorType}</td>
                <td style={styles.td}>{v.name}</td>
                <td style={styles.td}>{v.company}</td>
                <td style={styles.td}>{v.purpose}</td>
                <td style={styles.td}>{v.whomToMeet || "--"}</td>

                <td style={styles.dateTd}>
                  {v.checkinTime ? new Date(v.checkinTime).toLocaleString() : "--"}
                </td>

                <td style={styles.dateTd}>
                  {v.checkoutTime ? new Date(v.checkoutTime).toLocaleString() : "--"}
                </td>

                <td style={{ ...styles.td, textAlign: "center" }}>
                  <span
                    style={
                      v.status === "Inside"
                        ? styles.insideBadge
                        : styles.outBadge
                    }
                  >
                    {v.status}
                  </span>
                </td>

                <td style={{ ...styles.td, textAlign: "center" }}>
                  {v.idProofFile && (
                    <button
                      style={styles.docBtn}
                      onClick={() => openDoc(v.idProofFile)}
                    >
                      ID Proof
                    </button>
                  )}
                </td>

                {/* 🔥 FIX IS HERE */}
                <td style={{ ...styles.td, textAlign: "center" }}>
                  {v.status === "Approved" && (
                    <>
                      <input
                        placeholder="Pass ID"
                        style={styles.passInput}
                        value={passInputs[v._id] || ""}
                        onChange={(e) =>
                          setPassInputs({
                            ...passInputs,
                            [v._id]: e.target.value,
                          })
                        }
                      />
                      <button
                        style={styles.checkinBtn}
                        onClick={() => setSelectedVisitor(v)}
                      >
                        Check In
                      </button>
                    </>
                  )}

                  {v.status === "Inside" && (
                    <button
                      style={styles.checkoutBtn}
                      onClick={() => checkOut(v._id)}
                    >
                      Check Out
                    </button>
                  )}
                </td>

                <td style={{ ...styles.td, textAlign: "center" }}>
                  <button
                    style={styles.passBtn}
                    onClick={() => navigate(`/pass/${v._id}`)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CAMERA MODAL */}
      {selectedVisitor && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBox}>
            <WebcamCapture onCapture={setPhoto} />
            {photo && (
              <button style={styles.passBtn} onClick={confirmCheckIn}>
                Confirm Check-In
              </button>
            )}
            <button
              style={styles.logoutBtn}
              onClick={() => setSelectedVisitor(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


/* ================= STYLES ================= */


const styles = {
  /* ================= PAGE ================= */
  page: {
    minHeight: "100vh",
    background: "#f6f3ee", // beige background like admin
    paddingBottom: "40px",
  },

  /* ================= HEADER (TOP BAR) ================= */
  header: {
    height: "64px",
    background: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 32px",
    borderBottom: "1px solid #e5e7eb",
  },

  logo: {
    height: "42px",
    objectFit: "contain",
  },

  logoutBtn: {
    background: "#ffffff",
    border: "1px solid #d1d5db",
    padding: "6px 18px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },

  /* ================= BLUE HERO CARD ================= */
  pageHeader: {
    margin: "24px 32px",
    background: "#1f3c88",
    borderRadius: "14px",
    padding: "36px",
    color: "white",
  },

  pageTitle: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "6px",
  },

  pageSubtitle: {
    fontSize: "15px",
    opacity: 0.9,
  },

  /* ================= STATS ================= */
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "24px",
    padding: "8px 32px 28px",
  },

  statCard: {
    background: "#ffffff",
    borderRadius: "14px",
    padding: "24px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },

  statLabel: {
    fontSize: "14px",
    color: "#64748b",
    marginBottom: "8px",
  },

  statValue: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#0f172a",
  },

  /* ================= SEARCH / FILTER ================= */
  filterRow: {
    display: "flex",
    gap: "12px",
    padding: "0 32px 24px",
    alignItems: "center",
  },

  search: {
    flex: 1,
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    background: "#ffffff",
  },

  /* ================= TABLE ================= */
  tableWrapper: {
    margin: "0 32px",
    background: "#ffffff",
    borderRadius: "14px",
    padding: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    padding: "14px 12px",
    fontSize: "13px",
    fontWeight: "700",
    background: "#f1f5f9",
    color: "#0f172a",
    textAlign: "left",
    borderBottom: "1px solid #e5e7eb",
  },

  td: {
    padding: "14px 12px",
    fontSize: "14px",
    color: "#111827",
    borderBottom: "1px solid #e5e7eb",
  },

  dateTd: {
    padding: "14px 12px",
    fontSize: "13px",
    whiteSpace: "nowrap",
    borderBottom: "1px solid #e5e7eb",
  },

  /* ================= STATUS BADGES ================= */
  insideBadge: {
    background: "#dcfce7",
    color: "#166534",
    padding: "6px 14px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "600",
  },

  outBadge: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "6px 14px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "600",
  },

  pendingBadge: {
    background: "#fff7ed",
    color: "#9a3412",
    padding: "6px 14px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "600",
  },

  /* ================= BUTTONS ================= */
  docBtn: {
    background: "#ffffff",
    border: "1px solid #d1d5db",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "13px",
  },

  checkoutBtn: {
    background: "#0b1d3a",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  passBtn: {
    background: "#1f3c88",
    color: "white",
    border: "none",
    padding: "6px 16px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
  },

  modalOverlay: {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.55)",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",   // 🔥 makes it appear at TOP
  paddingTop: "90px",         // 🔥 distance from top
  zIndex: 9999,
},

modalBox: {
  background: "#ffffff",
  padding: "22px",
  borderRadius: "16px",
  width: "360px",
  boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
  textAlign: "center",
},

};




export default SecurityDashboard;
