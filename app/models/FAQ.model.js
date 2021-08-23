import mongoose from 'mongoose';
const schema = mongoose.Schema(
  {
    question: { type: String, required: true },
    image: { type: String, default: null },
    listAnswer: { type: Array, default: [] },
    onwerId: { type: String, required: true },
    ownerName: { type: String, required: true },
    isSolve: { type: Boolean, default: false },
  },
  { timestamps: true }
);

schema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

export default mongoose.model('FAQs', schema);
