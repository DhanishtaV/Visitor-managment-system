const express = require("express");
const router = express.Router();
const Visitor = require("../models/Visitor");
const auth = require("../middleware/authMiddleware");

/* =====================================================
   GET TODAY'S VISITORS (Security View)
   ===================================================== */
router.get("/security/today", auth, async (req, res) => {
  try {
    if (req.user.role !== "security") {
      return res.status(403).json({ message: "Access denied" });
    }

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const visitors = await Visitor.find({
  createdAt: { $gte: start, $lte: end },
}).sort({ createdAt: -1 });

    res.json(visitors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   CHECK-IN WITH WEBCAM PHOTO + PASS ID
   Pending → Inside
   ===================================================== */
router.put("/security/checkin/:id/photo", auth, async (req, res) => {
  try {
    if (req.user.role !== "security") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { photo, passId } = req.body;

    if (!photo || !passId) {
      return res
        .status(400)
        .json({ message: "Photo and Pass ID are required" });
    }

    const visitor = await Visitor.findById(req.params.id);
    
    if (!visitor) {
      return res.status(404).json({ message: "Visitor not found" });
    }
    // 🚫 BLOCK SECURITY CHECK-IN IF NOT APPROVED
if (visitor.status !== "Approved") {
  return res.status(403).json({
    message: "Visitor not approved yet",
  });
}


    // 🔐 PASS ID VERIFICATION
    // Assign passId during first check-in
visitor.passId = passId;


    visitor.photo = photo;
    visitor.status = "Inside";
    visitor.checkinTime = new Date();
    visitor.checkoutTime = null;

    await visitor.save();

    res.json({
      message: "Visitor checked in successfully",
      visitor,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   MANUAL CHECK-OUT (Inside → Checked-out)
   ===================================================== */
router.put("/security/checkout/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "security") {
      return res.status(403).json({ message: "Access denied" });
    }

    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) {
      return res.status(404).json({ message: "Visitor not found" });
    }

    if (visitor.status !== "Inside") {
      return res.status(400).json({ message: "Visitor is not inside" });
    }

    visitor.status = "Checked-out";
    visitor.checkoutTime = new Date();

    await visitor.save();

    res.json({ message: "Visitor checked out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
