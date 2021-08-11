import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    owner: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    listComment: { type: Array, default: [] },
  },
  { timestamps: true }
);

postSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

export default mongoose.model('posts', postSchema);
