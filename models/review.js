const mongoose = require("mongoose");

// Capital S use karo variable ke naam me, best practice
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  comment: String,
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  createdat: {
    type: Date,
    default: Date.now
  },
  author: {
    type: Schema.Types.ObjectId,   // ✅ yahan fix
    ref: "user"
  }
});

module.exports = mongoose.model("review", reviewSchema);
