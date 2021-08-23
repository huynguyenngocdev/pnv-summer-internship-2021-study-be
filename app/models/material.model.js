import mongoose from 'mongoose';

const postSchema = mongoose.Schema(
  {
    ownerId: { type: String, required: true },
    ownerName: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    listComments: { type: Array, default: [] },
    fileAttachment: { type: Array, default: [] },
  },
  { timestamps: true }
);

postSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

export default mongoose.model('materials', postSchema);
