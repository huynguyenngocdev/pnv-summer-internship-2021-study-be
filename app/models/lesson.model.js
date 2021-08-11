import mongoose from 'mongoose';
const schema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    flashCards: [],
    color: {
      type: String,
    },
    star: {
      type: String,
      default: 1,
    },
    onwerId: {
      type: String,
    },
  },
  { timestamps: true }
);

schema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

export default mongoose.model('lesson', schema);
