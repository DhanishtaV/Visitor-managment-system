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
    idProofType: "",
    description: "",
  });

  const [files, setFiles] = useState({
    idProofFile: null,
    photoFile: null,

    // Vendor documents
    esiFile: null,
    pfFile: null,
    wcFile: null,
    insuranceFile: null,
    agreementFile: null,
  });

  const [message, setMessage] = useState("");

  // ---------------- Handle Text Inputs ----------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ---------------- Handle File Inputs ----------------
  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  // ---------------- FORM SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const fd = new FormData();

      Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
      fd.append("idProofFile", files.idProofFile);
      fd.append("photoFile", files.photoFile);

      // Vendor documents required ONLY for Vendor type
      if (formData.visitorType === "Vendor") {
        if (
          !files.esiFile ||
          !files.pfFile ||
          !files.wcFile ||
          !files.insuranceFile ||
          !files.agreementFile
        ) {
          setMessage("Please upload all vendor compliance documents.");
          return;
        }

        fd.append("esiFile", files.esiFile);
        fd.append("pfFile", files.pfFile);
        fd.append("wcFile", files.wcFile);
        fd.append("insuranceFile", files.insuranceFile);
        fd.append("agreementFile", files.agreementFile);
      }

      const res = await fetch("http://localhost:5000/api/checkin", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      if (res.ok) {
        navigate(`/pass/${data.id}`);
        return;
      }

      setMessage(data.message || "Something went wrong.");
    } catch (err) {
      setMessage("Server error");
    }
  };

  // ===================== UI =========================
  return (
    <div style={styles.page}>

      {/* ---------- HERO SECTION ---------- */}
      <div style={styles.hero}>
        <img src="/logo.png" alt="logo" style={styles.heroLogo} />

        <button style={styles.adminBtn} onClick={() => navigate("/login")}>
          Admin Login
        </button>

        <h1 style={styles.heroTitle}>Visitor Check-In Portal</h1>
      </div>

      {/* ---------- FLOATING FORM CARD ---------- */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Check-In Form</h2>

        <form onSubmit={handleSubmit}>
          {/* Visitor Type */}
          <h3 style={styles.sectionTitle}>Visitor Details</h3>

          <select
            name="visitorType"
            value={formData.visitorType}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Select Type</option>
            <option value="Visitor">Visitor</option>
            <option value="Vendor">Vendor</option>
          </select>

          <input
            style={styles.input}
            placeholder="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            style={styles.input}
            placeholder="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          <input
            style={styles.input}
            placeholder="Company Name"
            name="company"
            value={formData.company}
            onChange={handleChange}
          />

          <input
            style={styles.input}
            placeholder="Purpose of Visit"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
          />

          {/* ---------- ID SECTION ---------- */}
          <h3 style={styles.sectionTitle}>ID Proof & Photo</h3>

          <select
            name="idProofType"
            value={formData.idProofType}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Select ID Type</option>
            <option value="Aadhar">Aadhar</option>
            <option value="PAN">PAN</option>
            <option value="Driving License">Driving License</option>
            <option value="Employee ID">Employee ID</option>
          </select>

          {/* Two-column uploads */}
          <div style={styles.fileRow}>
            <div style={styles.fileCol}>
              <label style={styles.label}>Upload ID Proof</label>
              <input
                type="file"
                name="idProofFile"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                style={styles.fileInput}
              />
            </div>

            <div style={styles.fileCol}>
              <label style={styles.label}>Upload Photo</label>
              <input
                type="file"
                name="photoFile"
                accept="image/*"
                onChange={handleFileChange}
                style={styles.fileInput}
              />
            </div>
          </div>

          {/* Additional Info */}
          <h3 style={styles.sectionTitle}>Additional Info</h3>

          <textarea
            style={styles.textarea}
            placeholder="Items they are carrying..."
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
          />

          {/* ---------- VENDOR DOCUMENTS ---------- */}
          {formData.visitorType === "Vendor" && (
            <div style={{ marginTop: "25px" }}>
              <h3 style={styles.sectionTitle}>Vendor Compliance Documents</h3>

              <div style={styles.vendorGrid}>
                <div style={styles.vendorItem}>
                  <label style={styles.label}>ESI Document</label>
                  <input type="file" name="esiFile" style={styles.fileInput} onChange={handleFileChange} />
                </div>

                <div style={styles.vendorItem}>
                  <label style={styles.label}>PF Document</label>
                  <input type="file" name="pfFile" style={styles.fileInput} onChange={handleFileChange} />
                </div>

                <div style={styles.vendorItem}>
                  <label style={styles.label}>Workmen Compensation (WC)</label>
                  <input type="file" name="wcFile" style={styles.fileInput} onChange={handleFileChange} />
                </div>

                <div style={styles.vendorItem}>
                  <label style={styles.label}>Insurance Document</label>
                  <input type="file" name="insuranceFile" style={styles.fileInput} onChange={handleFileChange} />
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={styles.label}>Work Order / PO / Agreement</label>
                  <input type="file" name="agreementFile" style={styles.fileInput} onChange={handleFileChange} />
                </div>
              </div>
            </div>
          )}

          <button type="submit" style={styles.submitBtn}>✔ Check In</button>

          {message && <p style={styles.error}>{message}</p>}
        </form>
      </div>
    </div>
  );
}

// ------------------------ STYLES ------------------------
const styles = {
  page: {
    minHeight: "100vh",
    background: "#f2f4f8",
    paddingBottom: "60px",
  },

  hero: {
    background: "linear-gradient(135deg, #0d1b3d, #1f3b73)",
    padding: "40px 20px 80px",
    textAlign: "center",
    color: "white",
    borderBottomLeftRadius: "40px",
    borderBottomRightRadius: "40px",
    position: "relative",
  },

  heroLogo: {
    height: "110px",
    objectFit: "contain",
    marginBottom: "8px",
  },

  adminBtn: {
    position: "absolute",
    top: 20,
    right: 20,
    background: "#f4d07f",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
  },

  heroTitle: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#f4d07f",
  },

  card: {
    width: "90%",
    maxWidth: "700px",
    margin: "-50px auto 0",
    background: "white",
    padding: "35px",
    borderRadius: "20px",
    boxShadow: "0 12px 35px rgba(0,0,0,0.15)",
  },

  cardTitle: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: "24px",
    marginBottom: "20px",
  },

  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginTop: "22px",
    marginBottom: "10px",
  },

  input: {
    width: "100%",
    padding: "13px",
    borderRadius: "10px",
    border: "1px solid #cdd4df",
    background: "#f9fbff",
    marginBottom: "12px",
  },

  textarea: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #cdd4df",
    background: "#f9fbff",
    fontSize: "15px",
    marginBottom: "15px",
  },

  fileRow: {
    display: "flex",
    gap: "20px",
  },

  fileCol: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },

  label: {
    fontWeight: 500,
    marginBottom: "6px",
  },

  fileInput: {
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #cdd4df",
    background: "#f9fbff",
  },

  vendorGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginTop: "15px",
  },

  vendorItem: {
    display: "flex",
    flexDirection: "column",
  },

  submitBtn: {
    width: "100%",
    padding: "14px",
    marginTop: "20px",
    background: "#0d1b3d",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "17px",
    fontWeight: 600,
    cursor: "pointer",
  },

  error: {
    textAlign: "center",
    marginTop: "10px",
    color: "red",
  },
};

export default VisitorForm;
