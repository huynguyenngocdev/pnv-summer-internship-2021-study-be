import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, unique: true },
    name: { type: String, default: null },
    avatar: { type: String, default: null },
    email: { type: String, unique: true },
    block: { type: Boolean, default: 0 },
    myClassFolder: { type: String, default: null },
    token: { type: String },
  },
  { timestamps: true }
);

userSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

export default mongoose.model('users', userSchema);
