import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, default: '' },
    userId: { type: Number, required: true, unique: true },
    address: { type: String, default: '' },
    amount: { type: Number, default: 0 }
});

const UserModel = mongoose.model("user", UserSchema);

export default UserModel;