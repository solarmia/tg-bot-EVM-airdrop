export const commandList = [
    { command: 'start', description: 'Start the bot' },
    { command: 'address', description: 'Input or show your wallet address' },
    { command: 'amount', description: 'Check your claimable amount' },
];

import { userData } from "../data";
import { validatorAddr } from "../utils";
import * as helper from "./helper"

export const welcome = async (chatId: number, username?: string) => {
    helper.start(chatId, username)
    const title = `Welcome <i>${username}</i>`
    return { title }
}

export const addressCheck = async (chatId: number, new_address?: string) => {
    let title: string = ''
    let content: { text: string, callback_data: string }[][]
    if (new_address && !validatorAddr(new_address)) {
        title = `Invalid address, please register again`
        content = [[{ text: `Register`, callback_data: `wallet_register` }]]
    } else {
        const address = await helper.addressCheckDB(chatId, new_address)
        if (address) {
            title = `Your address is ${address}`
            content = [[{ text: `✅`, callback_data: `ok` }]]
        } else {
            title = `Please register new wallet address`
            content = [[{ text: `Register`, callback_data: `wallet_register` }]]
        }
    }
    return { title, content }
}

export const amountCheck = async (chatId: number) => {
    let title: string = ''
    let content: { text: string, callback_data: string }[][]
    const origin_amount = userData[chatId] ?? 0
    const amount = await helper.amountCheckDB(chatId, origin_amount)
    if (amount) {
        title = `Your amount is ${amount}`
    } else {
        title = `Empty balance`
    }
    content = [[{ text: `✅`, callback_data: `ok` }]]
    return { title, content }
}
