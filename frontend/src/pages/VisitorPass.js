import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function VisitorPass() {
  const { id } = useParams(); // 👈 get ID from URL
  const [visitor, setVisitor] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/visitors/${id}`)
      .then((res) => res.json())
      .then((data) => setVisitor(data))
      .catch((err) => console.log("Error loading visitor:", err));
  }, [id]);

  if (!visitor) {
    return (
      <h2 style={{ textAlign: "center", marginTop: "50px" }}>
        Loading visitor pass...
      </h2>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f2f4f7",
        fontFamily: "Arial",
        padding: "40px",
      }}
    >
      <div
        style={{
          width: "600px",
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "25px" }}>
          E - Visitor Pass
        </h2>

        {/* TOP SECTION */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {/* LEFT INFO */}
          <div style={{ fontSize: "16px", lineHeight: "28px" }}>
            <p>
              <strong>Visitor/Vendor Name:</strong> {visitor.name}
            </p>
            <p>
              <strong>Company Name:</strong> {visitor.company}
            </p>
            <p>
              <strong>Contact Number:</strong> {visitor.phone}
            </p>
            <p>
              <strong>Purpose:</strong> {visitor.purpose}
            </p>
            <p>
              <strong>Check-in Date & Time:</strong>{" "}
              {new Date(visitor.createdAt).toLocaleString()}
            </p>
          </div>

          {/* PHOTO */}
          <div
            style={{
              width: "150px",
              height: "180px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "#f9f9f9",
            }}
          >
            {visitor.photoFile ? (
              <img
                src={`http://localhost:5000/uploads/photos/${visitor.photoFile}`}
                alt="visitor"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <span style={{ color: "#777" }}>Photo</span>
            )}
          </div>
        </div>

        {/* SIGNATURE SECTION */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "40px",
          }}
        >
          <div
            style={{
              width: "45%",
              height: "80px",
              border: "1px solid #000",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "6px",
            }}
          >
            Security Sign
          </div>

          <div
            style={{
              width: "45%",
              height: "80px",
              border: "1px solid #000",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "6px",
            }}
          >
            Person Met Sign
          </div>
        </div>
      </div>
    </div>
  );
}

export default VisitorPass;
