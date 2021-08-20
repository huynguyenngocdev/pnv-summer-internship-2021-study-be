import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    className: { type: String, required: true },
    topic: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    member: { type: Number, default: 1 },
    ownerId: { type: String, required: true },
    ownerName: { type: String, required: true },
    listUserJoined: { type: Array, default: [] },
    backgroundImage: { type: String },
    listQuestions: { type: Array, default: [] },
    materials: { type: Array, default: [] },
  },
  { timestamps: true }
);

schema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

export default mongoose.model('classroom', schema);
