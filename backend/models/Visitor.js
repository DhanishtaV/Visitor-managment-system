const mongoose = require("mongoose");

const VisitorSchema = new mongoose.Schema(
  {
    visitorType: {
      type: String,
      enum: ["Visitor", "Vendor", "Corporate"],
      required: true,
    },

    name: { type: String, required: true },
    phone: { type: String, required: true },
    company: { type: String, required: true },
    purpose: { type: String, required: true },
    whomToMeet: { type: String, required: true },

    employeeId: {
      type: String,
      required: function () {
        return this.visitorType === "Corporate";
      },
    },

    idProofType: {
      type: String,
      required: function () {
        return this.visitorType !== "Corporate";
      },
    },

    idProofFile: {
      type: String,
      required: function () {
        return this.visitorType !== "Corporate";
      },
    },

    esiFile: {
      type: String,
      required: function () {
        return this.visitorType === "Vendor";
      },
    },
    pfFile: {
      type: String,
      required: function () {
        return this.visitorType === "Vendor";
      },
    },
    wcFile: {
      type: String,
      required: function () {
        return this.visitorType === "Vendor";
      },
    },
    insuranceFile: {
      type: String,
      required: function () {
        return this.visitorType === "Vendor";
      },
    },
    agreementFile: {
      type: String,
      required: function () {
        return this.visitorType === "Vendor";
      },
    },

    status: {
      type: String,
      enum: [
        "Pending Approval",
        "Approved",
        "Rejected",
        "Inside",
        "Checked-out",
      ],
      default: "Pending Approval",
    },

    approvalToken: String,
    approvalActionAt: Date,

    protocolAccepted: Boolean,
    protocolAcceptedAt: Date,

    checkinTime: { type: Date, default: Date.now },
    checkoutTime: Date,
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Visitor", VisitorSchema);
