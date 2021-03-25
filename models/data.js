const mongoose = require("mongoose");

const dataSchema = mongoose.Schema({
  clsName: {
    type: String,
    required: ["Please Provied The class Name", true],
  },
  regNo: {
    type: String,
  },
  label: {
    type: String,
  },
  descriptors: {
    type: [Array],
    default: [],
  },
});

const DataModel = mongoose.model("DataModel", dataSchema);

module.exports = DataModel;
