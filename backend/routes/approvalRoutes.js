const express = require("express");
const router = express.Router();
const Visitor = require("../models/Visitor");

/* ===============================
   APPROVE VISIT
================================ */
router.get("/approve/:token", async (req, res) => {
  try {
    const visitor = await Visitor.findOne({
      approvalToken: req.params.token,
    });

    if (!visitor) {
      return res.send("<h2>Invalid or expired approval link</h2>");
    }

    if (visitor.status === "Approved") {
      return res.send("<h2>This visit is already approved</h2>");
    }

    visitor.status = "Approved";
    visitor.approvalToken = null;
    visitor.approvalActionAt = new Date();

    await visitor.save();

    res.send(`
      <h2>✅ Visit Approved Successfully</h2>
      <p>Visitor: ${visitor.name}</p>
      <p>Purpose: ${visitor.purpose}</p>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

/* ===============================
   REJECT VISIT
================================ */
router.get("/reject/:token", async (req, res) => {
  try {
    const visitor = await Visitor.findOne({
      approvalToken: req.params.token,
    });

    if (!visitor) {
      return res.send("<h2>Invalid or expired approval link</h2>");
    }

    visitor.status = "Rejected";
    visitor.approvalToken = null;
    visitor.approvalActionAt = new Date();

    await visitor.save();

    res.send(`
      <h2>❌ Visit Rejected</h2>
      <p>Visitor: ${visitor.name}</p>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
