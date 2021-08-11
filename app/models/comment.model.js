import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    ownerId: { type: String, required: true },
    ownerName: { type: String, required: true },
    message: { type: String, required: true },
    isCommentCorrect: { type: Boolean, default: false },
    listReply: { type: Array },
  },
  { timestamps: true }
);

schema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const Comment = mongoose.model('comment', schema);
export default Comment;
