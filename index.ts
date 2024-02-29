import "dotenv/config";
import TelegramBot, { CallbackQuery, Message } from 'node-telegram-bot-api';
import * as commands from './commands'

const token = process.env.TOKEN
const bot = new TelegramBot(token!, { polling: true });

console.log("Bot started")

bot.on('callback_query', async (query: CallbackQuery) => {
    const chatId = query.message?.chat.id!
    const msgId = query.message?.message_id!
    const action = query.data!
    const username = query.message?.chat?.username!

    console.log(`${chatId} -> ${action}`)
    try {
        switch (action) {
            // case 'all':
            //     if (!(chatId in userData)) {
            //         userData[chatId] = {
            //             all: true,
            //             new: false,
            //             preset: false
            //         }
            //     }
            //     userData[chatId].all = true
            //     userData[chatId].new = false
            //     userData[chatId].preset = false
            //     await writeData(userData, userPath)
            //     bot.editMessageReplyMarkup(
            //         { inline_keyboard: trackOption(chatId).content },
            //         { chat_id: chatId, message_id: msgId }
            //     )
            //     break

            default:
                break
        }
    } catch (e) {
        console.log(e)
    }

})

bot.on(`message`, async (msg) => {
    const chatId = msg.chat.id!
    const text = msg.text!
    const msgId = msg.message_id!
    const username = msg.from!.username!
    console.log(`${chatId} -> ${text}`)
    try {
        switch (text) {
            case `/start`:
                bot.sendMessage(
                    chatId,
                    commands.welcome(chatId).title,
                    {
                        reply_markup: {
                            inline_keyboard: commands.welcome(chatId).content
                        }, parse_mode: 'HTML'
                    }
                )
                break;

            default:
                bot.deleteMessage(chatId, msgId)
                break
        }
    } catch (e) {
        console.log(e)
    }
});
