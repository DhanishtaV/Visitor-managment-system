const express = require("express");
const router = express.Router();
const Visitor = require("../models/Visitor");
const ExcelJS = require("exceljs");

/* ===============================
   VISITOR REPORT (EXCEL)
================================ */
router.get("/visitors", async (req, res) => {
  try {
    const { type, year } = req.query;

    const now = new Date();
    let startDate;
    let endDate = new Date();

    if (type === "daily") {
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
    } 
    else if (type === "weekly") {
      startDate = new Date();
      startDate.setDate(now.getDate() - 7);
    } 
    else if (type === "monthly") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } 
    else if (type === "yearly") {
      const selectedYear = year ? Number(year) : now.getFullYear();
      startDate = new Date(selectedYear, 0, 1);
      endDate = new Date(selectedYear, 11, 31, 23, 59, 59);
    } 
    else {
      return res.status(400).json({ message: "Invalid report type" });
    }

    const visitors = await Visitor.find({
      createdAt: { $gte: startDate, $lte: endDate },
    }).sort({ createdAt: -1 });

    // ===== EXCEL CREATION =====
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Visitors");

    sheet.columns = [
      { header: "Name", key: "name", width: 20 },
      { header: "Type", key: "visitorType", width: 15 },
      { header: "Company", key: "company", width: 20 },
      { header: "Purpose", key: "purpose", width: 25 },
      { header: "Whom To Meet", key: "whomToMeet", width: 20 },
      { header: "Status", key: "status", width: 15 },
      { header: "Check-in", key: "checkinTime", width: 22 },
      { header: "Check-out", key: "checkoutTime", width: 22 },
    ];

    visitors.forEach(v => {
      sheet.addRow({
        name: v.name,
        visitorType: v.visitorType,
        company: v.company,
        purpose: v.purpose,
        whomToMeet: v.whomToMeet,
        status: v.status,
        checkinTime: v.checkinTime,
        checkoutTime: v.checkoutTime || "--",
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=visitor-report-${type}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
