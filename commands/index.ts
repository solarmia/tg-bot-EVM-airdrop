export const commandList = [
    { command: 'start', description: 'Start the bot' },
    { command: 'address', description: 'Input or show your wallet address' },
    { command: 'amount', description: 'Check your claimable amount' },
];

import { webSite } from "../config";
import { userData } from "../data";
import { validatorAddr } from "../utils";
import * as helper from "./helper"

export const welcome = async (chatId: number, username?: string) => {
    const amount = await helper.start(chatId, username)
    const title = `This is the airdrop for historical Kleros users
You are logged in as @${username}
Your allocation is: ${amount}
You can check the balances and calculation on this page: ${webSite}
Reply with your address to receive tokens
`
    const content = [[{ text: '✏️ Input wallet address', callback_data: 'wallet_register' }]]
    return { title, content }
}

export const addressAdd = async (chatId: number, new_address: string) => {
    let title: string = ''
    let content: { text: string, callback_data: string }[][]
    if (new_address && !validatorAddr(new_address)) {
        title = `Invalid address, please register again`
        content = [[{ text: `✏️ Register again`, callback_data: `wallet_register` }]]
    } else {
        const address = await helper.addressAddDB(chatId, new_address)
        if (address == new_address) {
            title = `You input this address: <a href='https://gnosisscan.io/address/${address}'>${address}</a>`
            content = [[{ text: `💰 Get airdrop to this address`, callback_data: `airdrop` }]]
        } else {
            title = `Register failed, please register again your wallet address`
            content = [[{ text: `✏️ Input wallet address`, callback_data: `wallet_register` }]]
        }
    }
    return { title, content }
}

export const amountCheck = async (chatId: number) => {
    let title: string = ''
    let content: { text: string, callback_data: string }[][]
    const info = await helper.amountCheckDB(chatId)
    if (info) {
        title = `Your allocation is: ${info.amount}`
        content = [[{ text: `${info.address ? (!info.claimable ? '💰 Get airdrop' : '💸 You have already claimed') : '✏️ Input wallet address'}`, callback_data: `${info.address ? (!info.claimable ? 'airdrop' : 'ok') : 'wallet_register'}` }]]
    } else {
        title = `You have not login yet`
        content = [[{ text: `👨‍💼 Login`, callback_data: `wallet_register` }]]
    }
    return { title, content }
}


export const addressCheck = async (chatId: number) => {
    let title: string = ''
    let content: { text: string, callback_data: string }[][]
    const address = await helper.addressCheckDB(chatId)
    if (address) {
        title = `You input this address: <a href='https://gnosisscan.io/address/${address}'>${address}</a>`
        content = [[{ text: `💰 Get airdrop to this address`, callback_data: `airdrop` }]]
    } else {
        title = `You didn't register wallet address yet`
        content = [[{ text: `✏️ Input wallet address`, callback_data: `wallet_register` }]]
    }
    return { title, content }
}

export const handleAirdrop = async (chatId: number) => {
    let title: string = ''
    // let content: { text: string, callback_data: string }[][]
    const tx = await helper.airdrop(chatId)
    if (tx) {
        title = `Transaction success`
        const content = [[{ text: `🔎 View on explorer`, url: `https://gnosisscan.io/tx/${tx}` }]]
        return { title, content }
    } else {
        title = `Transaction failed`
        const content = [[{ text: `Transaction failed`, callback_data: `start_menu` }]]
        return { title, content }
    }
}