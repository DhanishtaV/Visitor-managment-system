import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function VisitorPass() {
  const { id } = useParams();
  const [visitor, setVisitor] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVisitor = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/visitor/${id}`);
        const data = await res.json();

        if (!res.ok) setError(data.message || "Failed to load pass");
        else setVisitor(data);
      } catch {
        setError("Server error");
      }
    };
    fetchVisitor();
  }, [id]);

  if (error) return <p style={{ textAlign: "center" }}>{error}</p>;
  if (!visitor) return <p style={{ textAlign: "center" }}>Loading pass...</p>;

  return (
    <div style={styles.page}>
      <div className="print-pass" style={styles.pass}>
        {/* HEADER */}
        <div style={styles.header}>
          <img src="/thejo-logo.png" alt="Logo" style={styles.logo} />
          <div style={styles.headerText}>
            <h2 style={styles.title}>VISITOR PASS</h2>
            <p style={styles.subtitle}>Authorized Entry</p>
          </div>
        </div>

        {/* PASS ID */}
        <div style={styles.passIdBox}>
          PASS ID · {visitor.passId}
        </div>

        {/* DETAILS */}
        <div style={styles.details}>
          <Info label="Name" value={visitor.name} />
          <Info label="Type" value={visitor.visitorType} />
          <Info label="Company" value={visitor.company} />
          <Info label="Purpose" value={visitor.purpose} />
          <Info label="Whom to Meet" value={visitor.whomToMeet || "--"} />
          <Info label="Status" value={visitor.status} />
          <Info
            label="Check-in"
            value={
              visitor.checkinTime
                ? new Date(visitor.checkinTime).toLocaleString()
                : "Not yet"
            }
          />
        </div>

        {/* FOOTER */}
        <div style={styles.footer}>
          Please present this pass at the security desk
        </div>

        {/* PRINT */}
        <button
          onClick={() => window.print()}
          style={styles.printBtn}
        >
          Print Pass
        </button>
      </div>

      {/* PRINT CSS */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-pass, .print-pass * {
              visibility: visible;
            }
            .print-pass {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            button {
              display: none;
            }
          }

          @media (max-width: 600px) {
            .print-pass {
              padding: 24px !important;
            }
          }
        `}
      </style>
    </div>
  );
}

/* SMALL REUSABLE ROW */
function Info({ label, value }) {
  return (
    <div style={styles.row}>
      <span style={styles.label}>{label}</span>
      <span style={styles.value}>{value}</span>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4f6fb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },

  pass: {
    background: "white",
    width: "100%",
    maxWidth: "520px",
    borderRadius: "22px",
    padding: "36px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
    boxSizing: "border-box",
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: "16px",
    marginBottom: "20px",
  },

  logo: {
    height: "60px",
  },

  headerText: {
    flex: 1,
  },

  title: {
    margin: 0,
    fontSize: "20px",
    letterSpacing: "1.5px",
    color: "#0b1d3a",
  },

  subtitle: {
    margin: 0,
    fontSize: "13px",
    color: "#6b7280",
  },

  passIdBox: {
    background: "linear-gradient(90deg, #eef2ff, #e0e7ff)",
    padding: "12px",
    borderRadius: "12px",
    textAlign: "center",
    fontWeight: "700",
    letterSpacing: "1px",
    marginBottom: "22px",
    color: "#0b1d3a",
  },

  details: {
    display: "grid",
    rowGap: "14px",
    marginBottom: "24px",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px dashed #e5e7eb",
    paddingBottom: "6px",
    fontSize: "15px",
  },

  label: {
    color: "#6b7280",
    fontWeight: "600",
  },

  value: {
    color: "#111827",
    fontWeight: "500",
    textAlign: "right",
    maxWidth: "60%",
  },

  footer: {
    textAlign: "center",
    fontSize: "13px",
    color: "#6b7280",
    marginBottom: "20px",
  },

  printBtn: {
    width: "100%",
    padding: "12px",
    background: "#0d6efd",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default VisitorPass;
