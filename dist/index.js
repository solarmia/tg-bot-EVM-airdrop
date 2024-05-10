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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const commands = __importStar(require("./commands"));
const config_1 = require("./config");
// import { init } from "./commands/helper";
const token = config_1.botToken;
const bot = new node_telegram_bot_api_1.default(token, { polling: true });
let botName;
let editText;
console.log("Bot started");
bot.getMe().then(user => {
    botName = user.username.toString();
});
bot.setMyCommands(commands.commandList);
(0, config_1.init)();
bot.on(`message`, async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const msgId = msg.message_id;
    const username = msg.from.username;
    if (text)
        console.log(`message : ${chatId} -> ${text}`);
    else
        return;
    try {
        let result;
        switch (text) {
            case `/start`:
                result = await commands.welcome(chatId, username);
                await bot.sendMessage(chatId, result.title, {
                    reply_markup: {
                        inline_keyboard: result.content
                    }, parse_mode: 'HTML'
                });
                break;
            // case `/address`:
            //     result = await commands.addressAdd(chatId)
            //     await bot.sendMessage(
            //         chatId,
            //         result.title, {
            //         reply_markup: {
            //             inline_keyboard: result.content,
            //         }
            //     })
            //     break;
            case `/amount`:
                await bot.deleteMessage(chatId, msgId);
                result = await commands.amountCheck(chatId);
                await bot.sendMessage(chatId, result.title, {
                    reply_markup: {
                        inline_keyboard: result.content,
                        force_reply: false, // Disable input field
                    }
                });
                break;
            default:
                await bot.deleteMessage(chatId, msgId);
        }
    }
    catch (e) {
        console.log('error -> \n', e);
    }
});
bot.on('callback_query', async (query) => {
    var _a, _b, _c, _d;
    const chatId = (_a = query.message) === null || _a === void 0 ? void 0 : _a.chat.id;
    const msgId = (_b = query.message) === null || _b === void 0 ? void 0 : _b.message_id;
    const action = query.data;
    const username = (_d = (_c = query.message) === null || _c === void 0 ? void 0 : _c.chat) === null || _d === void 0 ? void 0 : _d.username;
    const callbackQueryId = query.id;
    console.log(`query : ${chatId} -> ${action}`);
    try {
        let result;
        switch (action) {
            case 'wallet_register':
                const input_msg = await bot.sendMessage(chatId, 'Input your wallet address');
                bot.once(`message`, async (msg) => {
                    if (msg.text) {
                        result = await commands.addressAdd(chatId, msg.text);
                        await bot.sendMessage(chatId, result.title, {
                            reply_markup: {
                                inline_keyboard: result.content,
                                force_reply: false, // Disable input field
                            }
                        });
                        await bot.deleteMessage(chatId, input_msg.message_id);
                    }
                });
                break;
        }
    }
    catch (e) {
    }
});
// await bot.answerCallbackQuery(callbackQueryId, { text: 'Input Token address to buy' })
//# sourceMappingURL=index.js.map