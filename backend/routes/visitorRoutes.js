const express = require("express");
const router = express.Router();
const Visitor = require("../models/Visitor");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const approvalEmailTemplate = require("../utils/approvalEmailTemplate");
const { sendApprovalMail } = require("../utils/mailer");
const ExcelJS = require("exceljs");

/* =====================================================
   FILE UPLOAD CONFIG
===================================================== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(
      null,
      Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname)
    ),
});

const upload = multer({ storage });

/* =====================================================
   VISITOR CHECK-IN
===================================================== */
router.post(
  "/checkin",
  upload.fields([
    { name: "idProofFile", maxCount: 1 },
    { name: "esiFile", maxCount: 1 },
    { name: "pfFile", maxCount: 1 },
    { name: "wcFile", maxCount: 1 },
    { name: "insuranceFile", maxCount: 1 },
    { name: "agreementFile", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const files = req.files;

      const visitorData = {
        visitorType: req.body.visitorType,
        name: req.body.name,
        phone: req.body.phone,
        company: req.body.company,
        purpose: req.body.purpose,
        whomToMeet: req.body.whomToMeet,
        description: req.body.description,
        idProofType: req.body.idProofType,

        ...(req.body.visitorType === "Corporate" && {
          employeeId: req.body.employeeId,
        }),

        approvalToken: crypto.randomBytes(32).toString("hex"),
        protocolAccepted: true,
        protocolAcceptedAt: new Date(),

        ...(req.body.visitorType !== "Corporate" && {
          idProofFile: files?.idProofFile?.[0]?.filename,
        }),

        ...(req.body.visitorType === "Vendor" && {
          esiFile: files?.esiFile?.[0]?.filename,
          pfFile: files?.pfFile?.[0]?.filename,
          wcFile: files?.wcFile?.[0]?.filename,
          insuranceFile: files?.insuranceFile?.[0]?.filename,
          agreementFile: files?.agreementFile?.[0]?.filename,
        }),
      };

      const visitor = await Visitor.create(visitorData);

      const approveLink = `http://localhost:5001/api/approval/approve/${visitor.approvalToken}`;
      const rejectLink = `http://localhost:5001/api/approval/reject/${visitor.approvalToken}`;

      const emailHtml = approvalEmailTemplate({
        name: visitor.name,
        company: visitor.company,
        purpose: visitor.purpose,
        approveLink,
        rejectLink,
      });

      await sendApprovalMail({
        to: "vdhanishta@gmail.com",
        subject: "Visitor Approval Required – THEJO",
        html: emailHtml,
      });

      res.status(201).json({ message: "Check-in successful", id: visitor._id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* =====================================================
   GET VISITOR PASS
===================================================== */
router.get("/visitor/:id", async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) return res.status(404).json({ message: "Not found" });
    res.json(visitor);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   LIST VISITORS
===================================================== */
router.get("/visitors", async (req, res) => {
  const visitors = await Visitor.find().sort({ createdAt: -1 });
  res.json(visitors);
});

/* =====================================================
   EXCEL REPORT (FINAL + WORKING)
===================================================== */
router.get("/visitors/report", async (req, res) => {
  try {
    const { from, to } = req.query;
    if (!from || !to)
      return res.status(400).json({ message: "Date range required" });

    const startDate = new Date(from);
    const endDate = new Date(to);
    endDate.setHours(23, 59, 59, 999);

    const visitors = await Visitor.find({
      createdAt: { $gte: startDate, $lte: endDate },
    });

    const workbook = new ExcelJS.Workbook();

    /* ---------- DATA SHEET ---------- */
    const sheet = workbook.addWorksheet("Visitors");

    sheet.columns = [
      { header: "Name", key: "name", width: 20 },
      { header: "Type", key: "visitorType", width: 15 },
      { header: "Company", key: "company", width: 20 },
      { header: "Purpose", key: "purpose", width: 25 },
      { header: "Status", key: "status", width: 15 },
      { header: "Check-in", key: "checkinTime", width: 22 },
      { header: "Check-out", key: "checkoutTime", width: 22 },
    ];

    visitors.forEach(v =>
      sheet.addRow({
        name: v.name,
        visitorType: v.visitorType,
        company: v.company,
        purpose: v.purpose,
        status: v.status,
        checkinTime: v.checkinTime?.toLocaleString(),
        checkoutTime: v.checkoutTime?.toLocaleString(),
      })
    );

    sheet.getRow(1).font = { bold: true };

    /* ---------- SUMMARY SHEET ---------- */
    const summary = workbook.addWorksheet("Summary");

    summary.addRows([
      ["Category", "Count"],
      ["Total", visitors.length],
      ["Visitors", visitors.filter(v => v.visitorType === "Visitor").length],
      ["Vendors", visitors.filter(v => v.visitorType === "Vendor").length],
      ["Corporate", visitors.filter(v => v.visitorType === "Corporate").length],
    ]);

    summary.getRow(1).font = { bold: true };
    summary.columns = [{ width: 25 }, { width: 15 }];

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Visitor_Report.xlsx`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Excel generation failed" });
  }
});

module.exports = router;
