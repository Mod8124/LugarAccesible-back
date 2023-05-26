import mongoose, { model } from 'mongoose';
const schema = mongoose.Schema;

const feedbackSchema = new schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  overallSatisfaction: {
    type: Number,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  msg: {
    type: String,
    required: true,
  },
});

const Feedback = model('Feedback', feedbackSchema);

export default Feedback;
