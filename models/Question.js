// models/Question.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Question schema to represent a single question, its options, and answer
const QuestionSchema = new Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  answer: { type: String, required: true }
});

// Schema for each data part (e.g., part1, part2, final)
const DataPartSchema = new Schema({
  // partId: { type: String, required: true },
  name: { type: String, required: true },
  data: [QuestionSchema] // Array of questions
});


module.exports = mongoose.model("Quize", DataPartSchema);
// Export the model

