import { useState } from "react";
import { useNavigate } from "react-router-dom";

function VisitorForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    visitorType: "",
    name: "",
    phone: "",
    company: "",
    purpose: "",
    whomToMeet: "",
    idProofType: "",
    description: "",
  });

  const [files, setFiles] = useState({
    idProofFile: null,
    esiFile: null,
    pfFile: null,
    wcFile: null,
    insuranceFile: null,
    agreementFile: null,
  });

  const [message, setMessage] = useState("");
  const [employeeId, setEmployeeId] = useState("");

  const [visitedProtocol, setVisitedProtocol] = useState(false);
  const [protocolAccepted, setProtocolAccepted] = useState(false);

  /* ================= HANDLERS ================= */
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) =>
    setFiles({ ...files, [e.target.name]: e.target.files[0] });

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!protocolAccepted) {
      alert("Please read and accept the Visitor Protocol");
      return;
    }

    try {
      const fd = new FormData();

      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));

      // ✅ CRITICAL FIX — send employeeId
      if (formData.visitorType === "Corporate") {
        fd.append("employeeId", employeeId);
      }

      // ID proof only for non-corporate
      if (formData.visitorType !== "Corporate") {
        fd.append("idProofFile", files.idProofFile);
      }

      // Vendor docs
      if (formData.visitorType === "Vendor") {
        Object.entries(files).forEach(
          ([k, v]) => v && fd.append(k, v)
        );
      }

      const res = await fetch("http://localhost:5001/api/checkin", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      res.ok ? navigate(`/pass/${data.id}`) : setMessage(data.message);
    } catch {
      setMessage("Server error");
    }
  };

  /* ================= UI ================= */
  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div />
        <img src="/thejo-logo.png" alt="Thejo Logo" style={styles.logo} />
        <button style={styles.loginBtn} onClick={() => navigate("/login")}>
          Login
        </button>
      </header>

      <div style={styles.card}>
        <h1 style={styles.title}>Visitor Check-In</h1>
        <p style={styles.subtitle}>Secure registration for authorized entry</p>

        <form onSubmit={handleSubmit}>
          <Section title="Visitor Details">
            <select
              name="visitorType"
              onChange={handleChange}
              style={styles.input}
              required
            >
              <option value="">Select Type</option>
              <option value="Visitor">Visitor</option>
              <option value="Vendor">Vendor</option>
              <option value="Corporate">Corporate Office Staff</option>
            </select>

            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              style={styles.input}
              required
            />

            <input
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
              style={styles.input}
              required
            />

            {formData.visitorType === "Corporate" && (
              <input
                placeholder="Employee ID"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                style={styles.input}
                required
              />
            )}

            <input
              name="company"
              placeholder="Company / Organization"
              onChange={handleChange}
              style={styles.input}
              required
            />

            <input
              name="purpose"
              placeholder="Purpose of Visit"
              onChange={handleChange}
              style={styles.input}
              required
            />

            <input
              name="whomToMeet"
              placeholder="Whom to Meet (Employee / Department)"
              onChange={handleChange}
              style={styles.input}
              required
            />
          </Section>

          {formData.visitorType !== "Corporate" && (
            <Section title="Identification">
              <select
                name="idProofType"
                onChange={handleChange}
                style={styles.input}
                required
              >
                <option value="">Select ID Proof</option>
                <option value="Aadhar">Aadhar</option>
                <option value="PAN">PAN</option>
                <option value="Driving License">Driving License</option>
              </select>

              <input
                type="file"
                name="idProofFile"
                onChange={handleFileChange}
                style={styles.file}
                required
              />
            </Section>
          )}

          {formData.visitorType === "Vendor" && (
            <Section title="Vendor Documents">
              {["esiFile", "pfFile", "wcFile", "insuranceFile", "agreementFile"].map(
                (doc) => (
                  <input
                    key={doc}
                    type="file"
                    name={doc}
                    onChange={handleFileChange}
                    style={styles.file}
                    required
                  />
                )
              )}
            </Section>
          )}

          <Section title="Additional Information">
            <textarea
              name="description"
              placeholder="Optional"
              onChange={handleChange}
              style={{ ...styles.input, height: "90px" }}
            />
          </Section>

          <div style={styles.protocolBox}>
            <input
              type="checkbox"
              disabled={!visitedProtocol}
              checked={protocolAccepted}
              onChange={(e) => setProtocolAccepted(e.target.checked)}
            />
            <span style={{ marginLeft: 10 }}>
              I have read and agree to the{" "}
              <span
                style={styles.protocolLink}
                onClick={() => {
                  setVisitedProtocol(true);
                  window.open("/visitor-protocol", "_blank");
                }}
              >
                Visitor Protocol & Safety Guidelines
              </span>
            </span>
          </div>

          <button
            type="submit"
            style={styles.submitBtn}
            disabled={!protocolAccepted}
          >
            Generate Visitor Pass
          </button>

          {message && <p style={styles.error}>{message}</p>}
        </form>
      </div>
    </div>
  );
}

/* ================= SECTION ================= */
function Section({ title, children }) {
  return (
    <div style={styles.sectionBox}>
      <h3 style={styles.sectionTitle}>{title}</h3>
      {children}
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  page: { minHeight: "100vh", background: "#f5f5ef" },
  header: {
    height: "120px",
    background: "#0b1d3a",
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    padding: "0 40px",
  },
  logo: { height: "70px", background: "white", borderRadius: "14px" },
  loginBtn: { justifySelf: "end", padding: "10px 24px" },
  card: { maxWidth: 760, margin: "40px auto", background: "white", padding: 46 },
  title: { textAlign: "center", fontSize: 30 },
  subtitle: { textAlign: "center", marginBottom: 40 },
  sectionBox: { marginBottom: 30 },
  sectionTitle: { fontSize: 14, textTransform: "uppercase" },
  input: { width: "100%", padding: 14, marginBottom: 14 },
  file: { width: "100%", marginBottom: 14 },
  protocolBox: { marginTop: 20 },
  protocolLink: { color: "#2563eb", cursor: "pointer" },
  submitBtn: { width: "100%", padding: 16, marginTop: 20 },
  error: { color: "red", textAlign: "center" },
};

export default VisitorForm;
