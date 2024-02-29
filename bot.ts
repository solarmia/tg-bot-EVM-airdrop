import TelegramBot, { CallbackQuery, Message } from 'node-telegram-bot-api';
import fs from 'fs';
import { chainSchema } from 'web3/lib/commonjs/eth.exports';
import Web3, { ChainIdMismatchError } from 'web3';
import { ethers } from 'ethers';

const ETH_RPC_URL = 'https://eth.drpc.org'

const writeData = async (data: any, path: any) => {
    const dataJson = JSON.stringify(data, null, 4);
    fs.writeFile(path, dataJson, (err) => {
        if (err) {
            console.log('Error writing file:', err);
        } else {
            console.log(`wrote file ${path}`);
        }
    });
}

const startMenu = (chatId: number) => {
    const userData: Iuser = JSON.parse(fs.readFileSync(userPath, `utf8`));
    const presetData: Ipreset = JSON.parse(fs.readFileSync(presetPath, `utf8`));
    const criteria: ICriteria = JSON.parse(fs.readFileSync(criteriaPath, `utf8`));
    const subscription: ISub = JSON.parse(fs.readFileSync(subscriptionPath, `utf8`));
    const payment: IPay = JSON.parse(fs.readFileSync(paymentPath, `utf8`));

    if (!(chatId in userData)) {
        userData[chatId] = {
            all: true,
            new: false,
            preset: false
        }
        writeData(userData, userPath)
    }

    if (!(chatId in criteria)) {
        criteria[chatId] = {
            pnl: false,
            ave: false,
            rate: false,
            fre: false
        }
        writeData(criteria, criteriaPath)
    }

    if (!(chatId in subscription)) {
        subscription[chatId] = {
            address: "",
            status: 0
        }
        writeData(criteria, criteriaPath)
    }

    let content
    if (payment.status && subscription[chatId].status == 0) {
        content = [
            [{ text: `Subscription` }],
        ]
    } else {
        content = [
            [{ text: `Notification Configuration` }, { text: `Top Trader Preset List` }],
            [{ text: `Top Trader Categories` }],
            [{ text: `Subscription` }]
        ]
    }
    if (chatId == 1690792017) {
        content.push([{ text: `Admin` }])
    }
    return content
}

const trackOption = (chatId: number) => {
    if (!(chatId in userData)) {
        userData[chatId] = {
            all: true,
            new: false,
            preset: false
        }
        writeData(userData, userPath)
    }

    const title = `Set your Notification Configuration`
    const content = [
        [{ text: `${userData[chatId].all ? '🟢' : '🔴'} Track new top trader wallets`, callback_data: `all` }],
        [{ text: `${userData[chatId].new ? '🟢' : '🔴'} Track top trader transactions`, callback_data: `new` }],
        [{ text: `${userData[chatId].preset ? '🟢' : '🔴'} Track specific addresses transactions`, callback_data: `preset` }]
    ]
    return { title, content }
}

const viewOptions = (chatId: number) => {
    if (!(chatId in criteria)) {
        criteria[chatId] = {
            pnl: false,
            ave: false,
            rate: false,
            fre: false
        }
        writeData(criteria, criteriaPath)
    }
    const title = `Set your criteria for view options`
    const content = [
        [{ text: `${criteria[chatId].fre ? '🟢' : '🔴'} Fresh wallets`, callback_data: 'fre' }],
        [{ text: `${criteria[chatId].rate ? '🟢' : '🔴'} High win rate`, callback_data: 'rate' }],
        [{ text: `${criteria[chatId].pnl ? '🟢' : '🔴'} Big PNL`, callback_data: 'pnl' }],
        [{ text: `${criteria[chatId].ave ? '🟢' : '🔴'} Average profit`, callback_data: 'ave' }]
    ]
    return { title, content }
}

const presetMenu = (chatId: number) => {
    let title = `🔔 Your following wallets 🔔\n`
    if (chatId in presetData) {
        presetData[chatId].map(addr => {
            title += `\n- ${addr}\n`
        })
    }
    title += `\n📝 Use buttons below to add/remove wallets to the list`
    const content = [
        [{ text: `➕ Add`, callback_data: 'add' }, { text: `➖ Remove`, callback_data: 'rem' }],
        [{ text: `🗑️ Clear`, callback_data: 'clear' }],
    ]

    return { title, content }
}

const inputAddr = (type: string | undefined) => {
    if (type != undefined) return `Please input address to ${type}`
    else `Some issues occurs, please try again`
}

const validateAddress = (addr: string) => {
    const regex = /^(0x)[0-9a-fA-F]{40}$/;
    return regex.test(addr);
}

const validatePrivatekey = (key: string) => {
    const regex = /^(0x)[0-9a-fA-F]{64}$/;
    const regexlink = /^(https:\/\/etherscan\.io\/tx\/)(0x)[0-9a-fA-F]{64}$/;
    return regex.test(key) || regexlink.test(key);
}

const sucess = (type: string) => {
    return `Successfully ${type}`
}

const invalidAddress = (addr: string) => {
    return `⚠️ Invalid address : ${addr}`
}

const subscriptionMenu = (chatId: number) => {
    if (!(chatId in subscription)) {
        subscription[chatId] = {
            address: "",
            status: 0
        }
        writeData(subscription, subscriptionPath)
    }
    const title = 'To access Envision Alerts, an active subscription is required.'
    console.log('addres', subscription[chatId].address)
    const content = subscription[chatId].address == '' ? [
        [{ text: `Please register your wallet address`, callback_data: 'add-address' }]] : [
        [{ text: `${subscription[chatId].status != 0 ? `🟢 ${subscription[chatId].status} days left` : '🔴 Please click to subscribe.'}`, callback_data: `${subscription[chatId].status != 0 ? 'ok' : 'payment'}` }]
    ]
    return { title, content }
}

const AdminMenu = () => {
    const title = 'This is admin menu'
    const content = [
        [{ text: `Wallet address : ${payment.address}`, callback_data: 'address' }],
        [{ text: `Fee : ${payment.fee}`, callback_data: 'fee' }],
        [{ text: `Subscription : ${payment.status ? '🟢 On' : '🔴 Off'}`, callback_data: 'sub-status' }],
    ]
    return { title, content }
}

const tracktoken = `6902728932:AAHKGq0-CxMa2VfDs26mRL2pbvxHEBou92k`
const trackbotName = `@envisionalertbot`
const token = `6772142565:AAFwGeTLHEkRKFeJ1lrEE6ZMFkKK-Vxve4s`
const botName = `@envisiontrackerbot`
// const track = new TelegramBot(tracktoken!, { polling: true });
const bot = new TelegramBot(token!, { polling: true });

interface Iuser {
    [key: number]: {
        all: boolean,
        new: boolean,
        preset: boolean
    }
}

interface ICriteria {
    [key: number]: {
        pnl: boolean,
        ave: boolean,
        fre: boolean
        rate: boolean
    }
}

interface Ipreset {
    [key: number]: string[]
}

interface ISub {
    [key: number]: {
        address: string,
        status: number
    }
}

interface IPay {
    address: string,
    fee: string
    status: boolean
}

const userPath = `./user.json`
const criteriaPath = `./criteria.json`
const presetPath = `./preset.json`
const subscriptionPath = `./subscription.json`
const paymentPath = `./payment.json`

const userData: Iuser = JSON.parse(fs.readFileSync(userPath, `utf8`));
const presetData: Ipreset = JSON.parse(fs.readFileSync(presetPath, `utf8`));
const criteria: ICriteria = JSON.parse(fs.readFileSync(criteriaPath, `utf8`));
const subscription: ISub = JSON.parse(fs.readFileSync(subscriptionPath, `utf8`));
const payment: IPay = JSON.parse(fs.readFileSync(paymentPath, `utf8`));

console.log('Bot started!')

bot.on('callback_query', async (query: CallbackQuery) => {
    const chatId = query.message?.chat.id!
    const msgId = query.message?.message_id!
    const action = query.data!
    const username = query.message?.chat?.username!

    console.log(`${chatId} -> ${action}`)
    try {
        switch (action) {
            case 'all':
                if (!(chatId in userData)) {
                    userData[chatId] = {
                        all: true,
                        new: false,
                        preset: false
                    }
                }
                userData[chatId].all = true
                userData[chatId].new = false
                userData[chatId].preset = false
                await writeData(userData, userPath)
                bot.editMessageReplyMarkup(
                    { inline_keyboard: trackOption(chatId).content },
                    { chat_id: chatId, message_id: msgId }
                )
                break

            case 'preset':
                if (!(chatId in userData)) {
                    userData[chatId] = {
                        all: true,
                        new: false,
                        preset: false
                    }
                }
                userData[chatId].new = false
                userData[chatId].all = false
                userData[chatId].preset = true
                await writeData(userData, userPath)
                bot.editMessageReplyMarkup(
                    { inline_keyboard: trackOption(chatId).content },
                    { chat_id: chatId, message_id: msgId }
                )
                break

            case 'new':
                if (!(chatId in userData)) {
                    userData[chatId] = {
                        all: true,
                        new: false,
                        preset: false
                    }
                }
                userData[chatId].new = true
                userData[chatId].all = false
                userData[chatId].preset = false

                await writeData(userData, userPath)
                bot.editMessageReplyMarkup(
                    { inline_keyboard: trackOption(chatId).content },
                    { chat_id: chatId, message_id: msgId }
                )
                break

            case 'enable_preset':
                if (!(chatId in userData)) {
                    userData[chatId] = {
                        all: true,
                        new: false,
                        preset: false
                    }
                }
                userData[chatId].preset = true
                userData[chatId].new = false
                userData[chatId].all = false
                await writeData(userData, userPath)
                bot.sendMessage(
                    chatId,
                    'You have set preset option enabled',
                    {
                        reply_markup: {
                            inline_keyboard: trackOption(chatId).content
                        }
                    }
                )
                break

            case 'add':
                let add = true
                bot.sendMessage(
                    chatId,
                    inputAddr('add')!
                )

                bot.on('message', message => {
                    if (add) {
                        const userInput = message.text!
                        if (validateAddress(userInput)) {
                            presetData[chatId].push((userInput).toLocaleLowerCase())
                            writeData(presetData, presetPath)
                            bot.sendMessage(
                                chatId,
                                sucess('added'))
                            add = false
                            return
                        } else {
                            bot.sendMessage(
                                chatId,
                                invalidAddress(userInput)
                            )
                            return
                        }
                    }
                })
                break

            case 'rem':
                let remove = true
                bot.sendMessage(
                    chatId,
                    inputAddr('remove')!
                )

                bot.on('message', message => {
                    if (remove) {
                        const userInput = message.text!
                        if (validateAddress(userInput)) {
                            if (presetData[chatId].includes(userInput.toLocaleLowerCase())) {
                                presetData[chatId] = presetData[chatId].filter(addr => addr != userInput.toLocaleLowerCase())
                                writeData(presetData, presetPath)
                                bot.sendMessage(
                                    chatId,
                                    sucess('removed'))
                                remove = false
                                return
                            } else {
                                bot.sendMessage(
                                    chatId,
                                    "Not exist in the list")
                                return
                            }
                        } else {
                            bot.sendMessage(
                                chatId,
                                invalidAddress(userInput)
                            )
                        }
                        return
                    }
                })
                break

            case 'clear':
                presetData[chatId] = presetData[chatId].filter(item => item = '')
                writeData(presetData, presetPath)
                bot.sendMessage(
                    chatId,
                    sucess('cleared all addresses')
                )
                break

            case 'pnl':
                if (!(chatId in criteria)) {
                    criteria[chatId] = {
                        pnl: false,
                        ave: false,
                        rate: false,
                        fre: false
                    }
                }
                criteria[chatId].pnl = !criteria[chatId].pnl
                await writeData(criteria, criteriaPath)
                bot.editMessageReplyMarkup(
                    { inline_keyboard: viewOptions(chatId).content },
                    { chat_id: chatId, message_id: msgId }
                )
                break

            case 'ave':
                if (!(chatId in criteria)) {
                    criteria[chatId] = {
                        pnl: false,
                        ave: false,
                        rate: false,
                        fre: false
                    }
                }
                criteria[chatId].ave = !criteria[chatId].ave
                await writeData(criteria, criteriaPath)
                bot.editMessageReplyMarkup(
                    { inline_keyboard: viewOptions(chatId).content },
                    { chat_id: chatId, message_id: msgId }
                )
                break

            case 'fre':
                if (!(chatId in criteria)) {
                    criteria[chatId] = {
                        pnl: false,
                        ave: false,
                        rate: false,
                        fre: false
                    }
                }
                criteria[chatId].fre = !criteria[chatId].fre
                await writeData(criteria, criteriaPath)
                bot.editMessageReplyMarkup(
                    { inline_keyboard: viewOptions(chatId).content },
                    { chat_id: chatId, message_id: msgId }
                )
                break

            case 'rate':
                if (!(chatId in criteria)) {
                    criteria[chatId] = {
                        pnl: false,
                        ave: false,
                        rate: false,
                        fre: false
                    }
                }
                criteria[chatId].rate = !criteria[chatId].rate
                await writeData(criteria, criteriaPath)
                bot.editMessageReplyMarkup(
                    { inline_keyboard: viewOptions(chatId).content },
                    { chat_id: chatId, message_id: msgId }
                )
                break

            case 'payment':
                if (subscription[chatId].address == "") {
                    const ctx = bot.sendMessage(
                        chatId,
                        `Please input your address`
                    )

                    bot.once('message', async message => {
                        bot.deleteMessage(chatId, (await ctx).message_id)
                        const userinput = message.text!
                        if (validateAddress(userinput)) {
                            const sctx2 = bot.sendMessage(
                                chatId,
                                sucess('added your wallet address')
                            )
                            subscription[chatId].address = userinput
                            writeData(subscription, subscriptionPath)
                            bot.deleteMessage(chatId, (await sctx2).message_id)

                            const mctx = await bot.sendMessage(
                                chatId,
                                `Please input your transaction hash, payment address: <code>${payment.address}</code>`,
                                { parse_mode: 'HTML' }
                            )

                            bot.once('message', async (message) => {
                                let transactionHash = message.text!
                                if (validatePrivatekey(transactionHash)) {
                                    const ctx = bot.sendMessage(
                                        chatId,
                                        'Checking now...'
                                    )
                                    if (transactionHash.includes("https://etherscan.io/tx/")) {
                                        transactionHash = transactionHash.split('/')[4]
                                        console.log('transactionHash', transactionHash)
                                    }

                                    const web3 = new Web3(ETH_RPC_URL)
                                    const tx = await web3.eth.getTransaction(transactionHash)
                                    console.log('txdata', tx!.from, tx!.to, Number(tx!.value) / Number(1e18))
                                    console.log(tx.from, subscription[chatId].address)
                                    if (tx.from.toLocaleLowerCase() == subscription[chatId].address.toLocaleLowerCase() && tx.to!.toLocaleLowerCase() == payment.address.toLocaleLowerCase() && Number(tx!.value) / Number(1e18) >= Number(payment.fee)) {
                                        bot.sendMessage(
                                            chatId,
                                            'Successfully purchased',
                                        )
                                        bot.deleteMessage(chatId, (await mctx).message_id)
                                        bot.deleteMessage(chatId, (await ctx).message_id)
                                        subscription[chatId].status = 30
                                        writeData(subscription, subscriptionPath)
                                        bot.sendMessage(
                                            chatId,
                                            `Welcome to Envision, please configure your bot.`,
                                            {
                                                reply_markup: {
                                                    keyboard: startMenu(chatId)
                                                }
                                            }
                                        )
                                    } else {
                                        bot.sendMessage(
                                            chatId,
                                            'Invalid transaction hash',
                                        )
                                    }
                                }
                            })

                        }
                    })
                } else {
                    const mctx = await bot.sendMessage(
                        chatId,
                        `Please input your transaction hash, payment address: <code>${payment.address}</code>`,
                        { parse_mode: 'HTML' }
                    )

                    bot.once('message', async (message) => {
                        let transactionHash = message.text!
                        if (validatePrivatekey(transactionHash)) {
                            const ctx = bot.sendMessage(
                                chatId,
                                'Checking now...'
                            )
                            if (transactionHash.includes("https://etherscan.io/tx/")) {
                                transactionHash = transactionHash.split('/')[4]
                                console.log('transactionHash', transactionHash)
                            }

                            const web3 = new Web3(ETH_RPC_URL)
                            const tx = await web3.eth.getTransaction(transactionHash)
                            console.log('txdata', tx!.from, tx!.to, Number(tx!.value) / Number(1e18))
                            console.log(tx.from, subscription[chatId].address)
                            if (tx.from.toLocaleLowerCase() == subscription[chatId].address.toLocaleLowerCase() && tx.to!.toLocaleLowerCase() == payment.address.toLocaleLowerCase() && Number(tx!.value) / Number(1e18) >= Number(payment.fee)) {
                                bot.sendMessage(
                                    chatId,
                                    'Successfully purchased',
                                )
                                bot.deleteMessage(chatId, (await mctx).message_id)
                                bot.deleteMessage(chatId, (await ctx).message_id)
                                subscription[chatId].status = 30
                                writeData(subscription, subscriptionPath)
                                bot.sendMessage(
                                    chatId,
                                    `Welcome to Envision, please configure your bot.`,
                                    {
                                        reply_markup: {
                                            keyboard: startMenu(chatId)
                                        }
                                    }
                                )
                            } else {
                                bot.sendMessage(
                                    chatId,
                                    'Invalid transaction hash',
                                )
                            }
                        }
                    })


                }
                break

            case 'address':
                bot.sendMessage(chatId, 'Set new address')
                bot.once('message', message => {
                    payment.address = message.text!
                    writeData(payment, paymentPath)
                    bot.sendMessage(chatId, sucess("changed"))
                })
                break

            case 'fee':
                bot.sendMessage(chatId, 'Set new fee')
                bot.once('message', message => {
                    payment.fee = (message.text!)
                    writeData(payment, paymentPath)
                    bot.sendMessage(chatId, sucess("changed"))
                })
                break

            case 'sub-status':
                payment.status = !payment.status
                writeData(payment, paymentPath)
                bot.editMessageReplyMarkup(
                    { inline_keyboard: AdminMenu().content },
                    { chat_id: chatId, message_id: msgId }
                )
                break

            case 'add-address':
                bot.deleteMessage(chatId, msgId)
                const ictx = bot.sendMessage(chatId, 'Input your wallet address')
                bot.once('message', async message => {
                    bot.deleteMessage(chatId, (await ictx).message_id)
                    if (validateAddress(message.text!)) {
                        subscription[chatId].address = message.text!
                        writeData(subscription, subscriptionPath)
                        // const sctx = bot.sendMessage(chatId, sucess("registered"))
                        const mctx = await bot.sendMessage(
                            chatId,
                            `Please input your transaction hash, payment address: <code>${payment.address}</code>`,
                            { parse_mode: 'HTML' }
                        )

                        bot.once('message', async (message) => {
                            bot.deleteMessage(chatId, (await mctx).message_id)
                            let transactionHash = message.text!
                            if (validatePrivatekey(transactionHash)) {
                                const ctx = bot.sendMessage(
                                    chatId,
                                    'Checking now...'
                                )
                                if (transactionHash.includes("https://etherscan.io/tx/")) {
                                    transactionHash = transactionHash.split('/')[4]
                                    console.log('transactionHash', transactionHash)
                                }

                                const web3 = new Web3(ETH_RPC_URL)
                                const tx = await web3.eth.getTransaction(transactionHash)
                                console.log('txdata', tx!.from, tx!.to, Number(tx!.value) / Number(1e18))
                                console.log(tx.from, subscription[chatId].address)
                                if (tx.from.toLocaleLowerCase() == subscription[chatId].address.toLocaleLowerCase() && tx.to!.toLocaleLowerCase() == payment.address.toLocaleLowerCase() && Number(tx!.value) / Number(1e18) >= Number(payment.fee)) {
                                    bot.sendMessage(
                                        chatId,
                                        'Successfully purchased',
                                    )
                                    bot.deleteMessage(chatId, (await ctx).message_id)
                                    subscription[chatId].status = 30
                                    writeData(subscription, subscriptionPath)
                                    bot.sendMessage(
                                        chatId,
                                        `Welcome to Envision, please configure your bot.`,
                                        {
                                            reply_markup: {
                                                keyboard: startMenu(chatId)
                                            }
                                        }
                                    )
                                } else {
                                    bot.sendMessage(
                                        chatId,
                                        'Invalid transaction hash',
                                    )
                                }
                            }
                        })
                    } else {
                        bot.sendMessage(chatId, "Invalid address")
                    }
                })
                break

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
                    `Welcome to Envision, please configure your bot.`,
                    {
                        reply_markup: {
                            keyboard: startMenu(chatId)
                        }
                    }
                )
                break;

            case `Notification Configuration`:
                bot.deleteMessage(chatId, msgId)
                bot.sendMessage(
                    chatId,
                    trackOption(chatId).title,
                    {
                        reply_markup: {
                            inline_keyboard: trackOption(chatId).content
                        }
                    }
                )
                break;

            case `Top Trader Preset List`:
                bot.deleteMessage(chatId, msgId)
                if (!userData[chatId].preset) {
                    bot.sendMessage(
                        chatId,
                        "You should set preset option enable first",
                        {
                            reply_markup: {
                                inline_keyboard: [[{
                                    text: "👉 Enable preset option", callback_data: 'enable_preset'
                                }]]
                            }
                        }
                    )
                } else {
                    bot.sendMessage(
                        chatId,
                        presetMenu(chatId).title,
                        {
                            reply_markup: {
                                inline_keyboard: presetMenu(chatId).content
                            }
                        }
                    )
                }
                break;

            case `Top Trader Categories`:
                bot.deleteMessage(chatId, msgId)
                bot.sendMessage(
                    chatId,
                    viewOptions(chatId).title,
                    {
                        reply_markup: {
                            inline_keyboard: viewOptions(chatId).content
                        }
                    }
                )
                break;

            case `Subscription`:
                bot.deleteMessage(chatId, msgId)
                bot.sendMessage(
                    chatId,
                    subscriptionMenu(chatId).title,
                    {
                        reply_markup: {
                            inline_keyboard: subscriptionMenu(chatId).content
                        }
                    }
                )
                break

            case `Admin`:
                bot.deleteMessage(chatId, msgId)
                bot.sendMessage(
                    chatId,
                    AdminMenu().title,
                    {
                        reply_markup: {
                            inline_keyboard: AdminMenu().content
                        }
                    }
                )
                break
            default:
                bot.deleteMessage(chatId, msgId)
                break
        }
    } catch (e) {
        console.log(e)
    }
});
