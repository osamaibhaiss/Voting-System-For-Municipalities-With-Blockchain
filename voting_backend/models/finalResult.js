const mongoose = require("mongoose");

const finalResultSchema = new mongoose.Schema({
  electionId: { type: mongoose.Schema.Types.ObjectId, ref: "Election", required: true },
  totalSeats: { type: Number, required: true },
  groupResults: [
    {
      name: String,
      votes: Number,
      seats: Number,
    },
  ],
  calculatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FinalResult", finalResultSchema);
