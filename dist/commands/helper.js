"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.airdrop = exports.amountCheckDB = exports.amountAddDB = exports.addressCheckDB = exports.addressAddDB = exports.start = void 0;
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
const addressCheckDB = async (userId) => {
    try {
        const data = await model_1.default.findOne({ userId }).select('address');
        if (data)
            return data.address;
        else
            return '';
    }
    catch (e) {
        console.log(e);
        return '';
    }
};
exports.addressCheckDB = addressCheckDB;
const amountAddDB = async (userId, amount) => {
    const data = await model_1.default.findOneAndUpdate({ userId }, { amount }, { upsert: true, new: true }).select('amount');
    return data.amount;
};
exports.amountAddDB = amountAddDB;
const amountCheckDB = async (userId) => {
    const data = await model_1.default.findOne({ userId });
    return data;
};
exports.amountCheckDB = amountCheckDB;
const airdrop = async (userId) => {
    // web3 airdrop -> get txhash -> check if tx success
    const origin = await model_1.default.findOne({ userId });
    if (origin === null || origin === void 0 ? void 0 : origin.claimable)
        return { error: 'you have alredy claimed' };
    // make tx
    const data = '0xae833772b424beb49d987af5f8dd6049cf5bb57d272e319577b31c0ef63d1643';
    const result = await model_1.default.findOneAndUpdate({ userId }, { claimable: true, claimTime: new Date() }, { new: true });
    return { tx: data };
};
exports.airdrop = airdrop;
//# sourceMappingURL=helper.js.map