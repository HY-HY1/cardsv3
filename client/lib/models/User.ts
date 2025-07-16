import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    name: {
      first: { type: String, required: true },
      last: { type: String, required: true },
    },
  },
  { timestamps: true }  
);

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
