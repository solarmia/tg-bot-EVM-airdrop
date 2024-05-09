"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.amountAddDB = exports.addressAddDB = exports.start = void 0;
const data_1 = require("../data");
const model_1 = __importDefault(require("../utils/model"));
const start = async (userId, username) => {
    var _a;
    try {
        const amount = (_a = data_1.userData[userId]) !== null && _a !== void 0 ? _a : 0;
        const info = await model_1.default.findOneAndUpdate({ userId }, { userId, username, amount }, { upsert: true });
        return amount;
    }
    catch (e) {
        console.log(e);
        return 0;
    }
};
exports.start = start;
const addressAddDB = async (userId, address) => {
    if (address) {
        try {
            const data = await model_1.default.findOneAndUpdate({ userId }, { userId, address }, { new: true, upsert: true }).select('address');
            return data.address;
        }
        catch (e) {
            console.log(e);
            return '';
        }
    }
};
exports.addressAddDB = addressAddDB;
const amountAddDB = async (userId, amount) => {
    const data = await model_1.default.findOneAndUpdate({ userId }, { amount }, { upsert: true, new: true }).select('amount');
    return data.amount;
};
exports.amountAddDB = amountAddDB;
//# sourceMappingURL=helper.js.map