const mongoose = require("mongoose");

const VisitorSchema = new mongoose.Schema({
  visitorType: { type: String, required: true },
  name: String,
  phone: String,
  company: String,
  purpose: String,
  description: String,
  idProofType: String,
  idProofFile: String,
  photoFile: String,
  status: String,
  checkoutTime: Date,

  // vendor documents
  esiFile: String,
  pfFile: String,
  wcFile: String,
  insuranceFile: String,
  agreementFile: String,
}, { timestamps: true });

module.exports = mongoose.model("Visitor", VisitorSchema);
