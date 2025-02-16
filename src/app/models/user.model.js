import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    user: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: Number, required: true },
    age: { type: Number, required: true },
    interest: { type: [String], required: true },
    status: { type: String, required: true, default: "active" }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
