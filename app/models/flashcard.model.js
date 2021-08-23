import mongoose from 'mongoose';
const schema = mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    color: { type: String, default: 'gray' },
    ownerId: { type: String, required: true },
  },
  { timestamps: true }
);

schema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

export default mongoose.model('FlashCard', schema);
