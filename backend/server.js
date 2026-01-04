require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const Visitor = require("./models/Visitor");
const app = express();
const { sendTestMail } = require("./utils/mailer");
const approvalRoutes = require("./routes/approvalRoutes");



/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/visitorRoutes"));
app.use("/api", require("./routes/adminRoutes"));
app.use("/api", require("./routes/security"));
app.use("/api/reports", require("./routes/reportRoutes"));
app.use("/api/approval", approvalRoutes);




/* ================= MONGODB ================= */
mongoose
  .connect("mongodb://127.0.0.1:27017/visitorDB")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

/* ================= MULTER CONFIG ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/idproofs");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* ================= TEST ROUTE ================= */
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend working ✅" });
});
app.get("/api/test-email", async (req, res) => {
  try {
    await sendTestMail("vdhanishta@gmail.com");
    res.send("Test email sent successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to send email");
  }
});


/* ================= CHECK-IN ================= */
app.post(
  "/api/checkin",
  upload.single("idProofFile"),
  async (req, res) => {
    try {
      console.log("REQ BODY:", req.body);
      console.log("REQ FILE:", req.file);

      const {
        visitorType,
        name,
        phone,
        company,
        purpose,
        idProofType,
        description,
      } = req.body;

      if (
        !visitorType ||
        !name ||
        !phone ||
        !company ||
        !purpose ||
        !idProofType ||
        !req.file
      ) {
        return res.status(400).json({
          message: "Missing required fields",
        });
      }

      const visitor = new Visitor({
        visitorType,
        name,
        phone,
        company,
        purpose,
        idProofType,
        description,
        idProofFile: req.file.path,
        status: "Pending",
        checkInTime: new Date(),
      });

      await visitor.save();

      res.status(201).json({
        message: "Check-in successful",
        _id: visitor._id,
      });
    } catch (err) {
      console.error("CHECK-IN ERROR:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* ================= ALL VISITORS ================= */
app.get("/api/visitors", async (req, res) => {
  const visitors = await Visitor.find().sort({ createdAt: -1 });
  res.json(visitors);
});

/* ================= PASS PAGE ================= */
app.get("/api/pass/:id", async (req, res) => {
  console.log("PASS ID RECEIVED 👉", req.params.id);

  const visitor = await Visitor.findById(req.params.id);

  if (!visitor) {
    console.log("❌ VISITOR NOT FOUND IN DB");
    return res.status(404).json({ message: "Visitor not found" });
  }

  res.json(visitor);
});



/* ================= SERVER ================= */
app.listen(5001, () => {
  console.log("🔥 SERVER RUNNING ON PORT 5001");
});
