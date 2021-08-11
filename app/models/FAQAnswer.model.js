import mongoose from 'mongoose';
const schema = mongoose.Schema(
  {
    anwer: {
      type: String,
      required: true,
    },
    userID: {
      type: String,
      required: true,
    },
    userName: {
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

export default mongoose.model('FAQAnswer', schema);
