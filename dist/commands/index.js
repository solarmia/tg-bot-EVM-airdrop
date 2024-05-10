"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.amountCheck = exports.addressAdd = exports.welcome = exports.commandList = void 0;
exports.commandList = [
    { command: 'start', description: 'Start the bot' },
    { command: 'address', description: 'Input or show your wallet address' },
    { command: 'amount', description: 'Check your claimable amount' },
];
const config_1 = require("../config");
const data_1 = require("../data");
const utils_1 = require("../utils");
const helper = __importStar(require("./helper"));
const welcome = async (chatId, username) => {
    const amount = await helper.start(chatId, username);
    const title = `This is the airdrop for historical Kleros users
You are logged in as @${username}
Your allocation is: ${amount}
You can check the balances and calculation on this page: ${config_1.webSite}
Reply with your address to receive tokens
`;
    const content = [[{ text: '✏️ Input wallet address', callback_data: 'wallet_register' }]];
    return { title, content };
};
exports.welcome = welcome;
const addressAdd = async (chatId, new_address) => {
    let title = '';
    let content;
    if (new_address && !(0, utils_1.validatorAddr)(new_address)) {
        title = `Invalid address, please register again`;
        content = [[{ text: `✏️ Register again`, callback_data: `wallet_register` }]];
    }
    else {
        const address = await helper.addressAddDB(chatId, new_address);
        if (address == new_address) {
            title = `I have received the address: ${address}`;
            content = [[{ text: `✅`, callback_data: `ok` }]];
        }
        else {
            title = `Register failed, please register again your wallet address`;
            content = [[{ text: `✏️ Input wallet address`, callback_data: `wallet_register` }]];
        }
    }
    return { title, content };
};
exports.addressAdd = addressAdd;
const amountCheck = async (chatId) => {
    var _a;
    let title = '';
    let content;
    const origin_amount = (_a = data_1.userData[chatId]) !== null && _a !== void 0 ? _a : 0;
    const amount = await helper.amountAddDB(chatId, origin_amount);
    if (amount) {
        title = `Your allocation is: ${amount}`;
    }
    else {
        title = `Empty balance`;
    }
    content = [[{ text: `✅`, callback_data: `ok` }]];
    return { title, content };
};
exports.amountCheck = amountCheck;
//# sourceMappingURL=index.js.map