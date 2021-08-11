import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    owner: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

schema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const ReplyComment = mongoose.model('replycomment', schema);

export default ReplyComment;
