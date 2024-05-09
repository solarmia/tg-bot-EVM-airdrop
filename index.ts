import "dotenv/config";
import TelegramBot, { CallbackQuery } from 'node-telegram-bot-api';

import * as commands from './commands'
import { botToken, init } from "./config";
// import { init } from "./commands/helper";

const token = botToken
const bot = new TelegramBot(token!, { polling: true });
let botName: string
let editText: string

console.log("Bot started");

bot.getMe().then(user => {
    botName = user.username!.toString()
})

bot.setMyCommands(commands.commandList)

init()

bot.on(`message`, async (msg) => {
    const chatId = msg.chat.id!
    const text = msg.text!
    const msgId = msg.message_id!
    const username = msg.from!.username!
    if (text) console.log(`message : ${chatId} -> ${text}`)
    else return
    try {
        let result
        switch (text) {
            case `/start`:
                result = await commands.welcome(chatId, username)
                await bot.sendMessage(
                    chatId,
                    result.title, {
                    reply_markup: {
                        inline_keyboard: result.content
                    }, parse_mode: 'HTML'
                })
                break;

            case `/address`:
                result = await commands.addressCheck(chatId)
                await bot.sendMessage(
                    chatId,
                    result.title, {
                    reply_markup: {
                        inline_keyboard: result.content,
                    }, parse_mode: 'HTML'
                })
                break;

            case `/amount`:
                await bot.deleteMessage(chatId, msgId)
                result = await commands.amountCheck(chatId)
                await bot.sendMessage(
                    chatId,
                    result.title, {
                    reply_markup: {
                        inline_keyboard: result.content,
                        force_reply: false, // Disable input field
                    }, parse_mode: 'HTML'
                })
                break;

            default:
                await bot.deleteMessage(chatId, msgId)
        }
    } catch (e) {
        console.log('error -> \n', e)
    }
});

bot.on('callback_query', async (query: CallbackQuery) => {
    const chatId = query.message?.chat.id!
    const msgId = query.message?.message_id!
    const action = query.data!
    const username = query.message?.chat?.username!
    const callbackQueryId = query.id;

    console.log(`query : ${chatId} -> ${action}`)
    try {
        let result
        switch (action) {
            case 'wallet_register':
                const input_msg = await bot.sendMessage(chatId, 'Input your wallet address')
                bot.once(`message`, async (msg) => {
                    if (msg.text) {
                        result = await commands.addressAdd(chatId, msg.text)
                        await bot.sendMessage(
                            chatId,
                            result.title, {
                            reply_markup: {
                                inline_keyboard: result.content,
                                force_reply: false, // Disable input field
                            },
                            parse_mode: 'HTML'
                        })

                        await bot.deleteMessage(chatId, input_msg.message_id)
                    }
                })
                break

            case 'airdrop':
                const tx_msg = await bot.sendMessage(chatId, 'Transaction confirming...')
                result = await commands.handleAirdrop(chatId)
                await bot.deleteMessage(chatId, tx_msg.message_id)
                await bot.sendMessage(
                    chatId,
                    result.title, {
                    reply_markup: {
                        inline_keyboard: result.content,
                        force_reply: false, // Disable input field
                    },
                    parse_mode: 'HTML'
                })
                break

            case 'start_menu':
                result = await commands.welcome(chatId, username)
                await bot.sendMessage(
                    chatId,
                    result.title, {
                    reply_markup: {
                        inline_keyboard: result.content
                    }, parse_mode: 'HTML'
                })
                break;
        }

    } catch (e) {

    }

})

// await bot.answerCallbackQuery(callbackQueryId, { text: 'Input Token address to buy' })
