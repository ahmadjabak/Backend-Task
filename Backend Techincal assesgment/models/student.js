const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  id: { type: String,unique: true },
  firstName: { type: String },
  lastName: { type: String },
  dateOfBirth: { type: Date },
  address: { type: String },
  phoneNumber: { type: String },
  countryCode: { type: String },
  creationDate:{type:Date,default:Date.now}
},
{ timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);