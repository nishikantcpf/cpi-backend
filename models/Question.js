const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  que_id: { type: Number, required: true },
  que: { type: String, required: true },
  option1: { type: String, required: true },
  option2: { type: String, required: true },
  option3: { type: String, required: true },
  option4: { type: String, required: true },
  correct_answer: { type: String, required: true },
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
