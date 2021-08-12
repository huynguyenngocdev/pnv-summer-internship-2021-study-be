import mongoose from 'mongoose';
const schema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
    },
    active: {
      type: Number,
      required: true,
    },
    listClassJoin: [],
    listClassOwn: [],
    folderFlashCard: {
      type: String,
      required: true,
      unique: true,
    },
    role: Number,
    phone: Number,
    dateOfBirth: Date,
  },
  { timestamps: true }
);

schema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

export default mongoose.model('user', schema);
