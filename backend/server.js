const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// MODELS
const Visitor = require("./models/Visitor");
const Admin = require("./models/Admin");

const app = express();

// --------------------------------------------
//   ENSURE UPLOAD FOLDERS EXIST
// --------------------------------------------
const uploadBase = path.join(__dirname, "uploads");

const folders = [
  "idproofs",
  "photos",
  "vendor_docs/esi",
  "vendor_docs/pf",
  "vendor_docs/wc",
  "vendor_docs/insurance",
  "vendor_docs/agreements",
];

folders.forEach((dir) => {
  const fullPath = path.join(uploadBase, dir);
  if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
});

// --------------------------------------------
//   MULTER STORAGE
// --------------------------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "idProofFile") cb(null, "uploads/idproofs");
    else if (file.fieldname === "photoFile") cb(null, "uploads/photos");
    else if (file.fieldname === "esiFile") cb(null, "uploads/vendor_docs/esi");
    else if (file.fieldname === "pfFile") cb(null, "uploads/vendor_docs/pf");
    else if (file.fieldname === "wcFile") cb(null, "uploads/vendor_docs/wc");
    else if (file.fieldname === "insuranceFile")
      cb(null, "uploads/vendor_docs/insurance");
    else if (file.fieldname === "agreementFile")
      cb(null, "uploads/vendor_docs/agreements");
    else cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1000000000);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// --------------------------------------------
//   MIDDLEWARE
// --------------------------------------------
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // serve PDF/images

// --------------------------------------------
//   MONGO CONNECTION
// --------------------------------------------
mongoose
  .connect("mongodb://127.0.0.1:27017/visitorDB")
  .then(() => console.log("MongoDB Connected ✔"))
  .catch((err) => console.log("Mongo Error:", err));

// --------------------------------------------
// ROOT TEST
// --------------------------------------------
app.get("/", (req, res) => {
  res.send("Backend is running ✔");
});

// =====================================================
//             VISITOR / VENDOR CHECK-IN
// =====================================================
app.post(
  "/api/checkin",
  upload.fields([
    { name: "idProofFile", maxCount: 1 },
    { name: "photoFile", maxCount: 1 },
    { name: "esiFile", maxCount: 1 },
    { name: "pfFile", maxCount: 1 },
    { name: "wcFile", maxCount: 1 },
    { name: "insuranceFile", maxCount: 1 },
    { name: "agreementFile", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { visitorType, name, phone, company, purpose, description, idProofType } = req.body;

      if (!visitorType || !name || !phone || !company || !purpose) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      if (!req.files.idProofFile || !req.files.photoFile) {
        return res.status(400).json({
          message: "ID Proof and Photo are required",
        });
      }

      // BASIC FILES
      const idProofFile = "idproofs/" + req.files.idProofFile[0].filename;
      const photoFile = "photos/" + req.files.photoFile[0].filename;

      // VENDOR DOCS — SAVE FULL PATHS
      const vendorDocs = {
        esiFile: req.files.esiFile
          ? `vendor_docs/esi/${req.files.esiFile[0].filename}`
          : "",
        pfFile: req.files.pfFile
          ? `vendor_docs/pf/${req.files.pfFile[0].filename}`
          : "",
        wcFile: req.files.wcFile
          ? `vendor_docs/wc/${req.files.wcFile[0].filename}`
          : "",
        insuranceFile: req.files.insuranceFile
          ? `vendor_docs/insurance/${req.files.insuranceFile[0].filename}`
          : "",
        agreementFile: req.files.agreementFile
          ? `vendor_docs/agreements/${req.files.agreementFile[0].filename}`
          : "",
      };

      // SAVE IN DB
      const newVisitor = new Visitor({
        visitorType,
        name,
        phone,
        company,
        purpose,
        description,
        idProofType,
        idProofFile,
        photoFile,
        status: "Inside",
        checkoutTime: null,
        ...vendorDocs,
      });

      await newVisitor.save();

      res.status(201).json({
        message: "Check-in successful",
        id: newVisitor._id,
      });
    } catch (err) {
      console.log("CHECK-IN ERROR:", err);
      res.status(500).json({ message: "Server error during check-in" });
    }
  }
);

// =====================================================
//                    GET ALL VISITORS
// =====================================================
app.get("/api/visitors", async (req, res) => {
  try {
    const data = await Visitor.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching visitors" });
  }
});

// =====================================================
//                 GET SINGLE VISITOR
// =====================================================
app.get("/api/visitors/:id", async (req, res) => {
  try {
    const v = await Visitor.findById(req.params.id);
    res.json(v);
  } catch (err) {
    res.status(500).json({ message: "Visitor fetch error" });
  }
});

// =====================================================
//                    CHECKOUT
// =====================================================
app.put("/api/checkout/:id", async (req, res) => {
  try {
    const updated = await Visitor.findByIdAndUpdate(
      req.params.id,
      { status: "Checked-out", checkoutTime: new Date() },
      { new: true }
    );
    res.json({ message: "Checkout successful", visitor: updated });
  } catch {
    res.status(500).json({ message: "Checkout error" });
  }
});

// =====================================================
//           ADMIN / SECURITY SIGNUP
// =====================================================
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const admin = new Admin({
      name,
      email,
      password: hashed,
      role: role || "security",
    });

    await admin.save();
    res.json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ message: "Signup error" });
  }
});

// =====================================================
//                 ADMIN / SECURITY LOGIN
// =====================================================
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign({ id: admin._id, role: admin.role }, "SECRET_KEY", {
      expiresIn: "1d",
    });

    res.json({
      message: "Login successful",
      token,
      role: admin.role,
    });
  } catch (err) {
    res.status(500).json({ message: "Login error" });
  }
});

// =====================================================
//                     START SERVER
// =====================================================
app.listen(5000, () => console.log("Server running on port 5000 ✔"));
