const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["admin", "security"], default: "security" } 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", AdminSchema);
