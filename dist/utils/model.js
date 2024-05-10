"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    username: { type: String, default: '' },
    userId: { type: Number, required: true, unique: true },
    address: { type: String, default: '' },
    amount: { type: Number, default: 0 },
    claimable: { type: Boolean, default: false },
    claimTime: { type: Date }
});
const UserModel = mongoose_1.default.model("user", UserSchema);
exports.default = UserModel;
//# sourceMappingURL=model.js.map