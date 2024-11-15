import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  fullname: string;
  email: string;
  password: string;
}

const UserSchema = new Schema<IUser>({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.models?.User || mongoose.model<IUser>("User", UserSchema);
export default User;
