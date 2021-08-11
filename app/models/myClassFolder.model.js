import mongoose from 'mongoose';
const schema = mongoose.Schema(
  {
    name: { type: String, required: true },
    classes: { type: Array, default: [] },
    color: { type: String, default: 'gray' },
    backgroundImage: { type: String, default: null },
    userName: { type: String, required: true },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

schema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

export default mongoose.model('myClassFolders', schema);
