import mongoose from 'mongoose';
const schema = mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
    },
    list: [
      {
        question: {
          type: String,
        },
        answer: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

schema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

export default mongoose.model('FlashCard', schema);
