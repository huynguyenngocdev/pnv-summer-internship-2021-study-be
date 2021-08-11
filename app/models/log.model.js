import mongoose from 'mongoose';
const schema = mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },
    logs: {
      type: String,
      required: true,
    },
    byUserId: String,
    classId: String,
  },
  { timestamps: true }
);

schema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

export default mongoose.model('Log', schema);
