import mongoose, { model } from 'mongoose';
const schema = mongoose.Schema;

const commentSchema = new schema({
  place_id: {
    type: String,
    required: [true, 'user is required'],
    unique: true,
  },
  comments: {
    type: [{ user_id: String, author: String, raking: Number, text: String }],
    required: false,
  },
});

const Comment = model('Comment', commentSchema);

export default Comment;
