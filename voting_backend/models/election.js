const mongoose = require("mongoose");

const electionSchema = new mongoose.Schema(
  {
    uid: {type: String},
    CityName: { type: String,required: true, minlength: 3, maxlength: 10240 },
    RegisterVotter:{type: Number},
    TotalGroups:{type: Number},
    ElectionDate: {type: Number,required: true},
    StartTime: {type: Number,required: true},
    EndTime: {type: Number,required: true},
    winnerGroupId:{type: Number},
    TxHash: {type: String},
    Groups: {type: [Object]},
  },
  { timestamps: true }
);

const Election = mongoose.model("Election", electionSchema);

exports.Election = Election;
