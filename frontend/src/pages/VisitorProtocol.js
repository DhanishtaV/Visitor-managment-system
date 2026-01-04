import { useNavigate } from "react-router-dom";

function VisitorProtocol() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>THEJO – Visitor Entry Protocol</h1>
        <p style={styles.subtitle}><b>Manufacturing Units</b></p>

        <div style={styles.card}>
          <p style={styles.intro}>
            Dear Visitor,<br /><br />
            During your visit at THEJO’s premises, your safety is our priority.
            Please carefully review the following visitor guidelines and protocols.
          </p>

          <hr style={styles.divider} />

          <Section title="1. Authorization">
            <li>Visitor has received the official Visitor Pass</li>
            <li>Visitor has been assigned a THEJO contact person</li>
          </Section>

          <Section title="2. General Guidelines">
            <li>Plant familiarization induction is completed</li>
            <li>Visitor ID must be worn at all times</li>
            <li>No alcohol, weapons, or explosives allowed</li>
            <li>All materials/tools must be declared at security</li>
            <li>Security instructions must be followed</li>
            <li>Visitor ID and PPE must be returned on exit</li>
          </Section>

          <Section title="3. Dress Code">
            <li>Full trousers and shirt mandatory</li>
            <li>Safety shoes required for process areas</li>
            <li>Sandals strictly not permitted</li>
            <li>Long hair must be tied (headgear provided)</li>
          </Section>

          <Section title="4. Safety Protocols">
            <li>High visibility jacket, helmet, goggles, gloves, ear plugs as required</li>
            <li>Follow walkways and signage</li>
            <li>Give way to vehicles and cranes</li>
          </Section>

          <Section title="5. Restrictions">
            <li>Restricted to designated visitor areas</li>
            <li>No touching of machines or materials</li>
            <li>No mobile phones inside factory premises</li>
          </Section>

          <p style={styles.note}>
            <b>Note:</b> Mobile phone violations may attract a fine of ₹1000.
          </p>

          <Section title="6. Drug & Alcohol – Zero Tolerance">
            <li>No alcohol, tobacco, or narcotics</li>
          </Section>

          <p style={styles.warning}>
            Violation may result in a ban from THEJO premises for a minimum of 3 years.
          </p>

          <Section title="7. Video & Photography">
            <li>Photography and videography are strictly prohibited</li>
            <li>Special permission required from Unit Head</li>
          </Section>

          <p style={styles.warning}>
            Violations may attract a fine of ₹5000 and immediate removal.
          </p>

          <Section title="8. Emergency Procedures">
            <li>Follow instructions from host/security</li>
            <li>Be familiar with emergency sirens and assembly points</li>
          </Section>

          <hr style={styles.divider} />

          <h3 style={styles.sectionTitle}>Declaration</h3>
          <p style={styles.declaration}>
            I confirm that I have been informed and inducted by THEJO personnel on all
            applicable safety and visitor guidelines. I indemnify M/s THEJO Engineering
            Ltd. from any loss, damage, or injury during my visit.
          </p>

          <button
            onClick={() => {
              localStorage.setItem("visitorProtocolRead", "true");
              window.close();
            }}
            style={styles.primaryBtn}
          >
            I have read and understood the Visitor Protocol
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===== Reusable Section Component ===== */
function Section({ title, children }) {
  return (
    <div style={{ marginBottom: "22px" }}>
      <h3 style={styles.sectionTitle}>{title}</h3>
      <ul style={styles.list}>{children}</ul>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    padding: "40px 16px",
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont",
  },

  container: {
    maxWidth: "900px",
    margin: "0 auto",
  },

  title: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "6px",
  },

  subtitle: {
    fontSize: "15px",
    color: "#475569",
    marginBottom: "28px",
  },

  card: {
    background: "white",
    borderRadius: "18px",
    padding: "32px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
  },

  intro: {
    fontSize: "15px",
    color: "#334155",
    lineHeight: "1.8",
    marginBottom: "24px",
  },

  sectionTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "8px",
  },

  list: {
    paddingLeft: "22px",
    fontSize: "15px",
    color: "#334155",
    lineHeight: "1.8",
  },

  divider: {
    border: "none",
    borderTop: "1px solid #e5e7eb",
    margin: "26px 0",
  },

  note: {
    fontSize: "14px",
    color: "#92400e",
    background: "#fef3c7",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "18px",
  },

  warning: {
    fontSize: "14px",
    color: "#991b1b",
    background: "#fee2e2",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "18px",
  },

  declaration: {
    fontSize: "15px",
    color: "#334155",
    lineHeight: "1.8",
    marginBottom: "24px",
  },

  primaryBtn: {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    background: "#0f172a",
    color: "white",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
  },
};

export default VisitorProtocol;
