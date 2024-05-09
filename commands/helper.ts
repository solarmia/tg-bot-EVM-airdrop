import { userData } from "../data"
import UserModel from "../utils/model"

export const start = async (userId: number, username?: string) => {
  try {
    const amount = userData[userId] ?? 0
    const info = await UserModel.findOneAndUpdate({ userId }, { userId, username, amount }, { upsert: true })
    return amount
  } catch (e) {
    console.log(e)
    return 0
  }
}

export const addressAddDB = async (userId: number, address: string) => {
  if (address) {
    try {
      const data = await UserModel.findOneAndUpdate({ userId }, { userId, address }, { new: true, upsert: true }).select('address')
      return data.address
    } catch (e) {
      console.log(e)
      return ''
    }
  }
}

export const addressCheckDB = async (userId: number) => {
  try {
    const data = await UserModel.findOne({ userId }).select('address')
    if(data) return data.address
    else return ''
  } catch (e) {
    console.log(e)
    return ''
  }
}

export const amountAddDB = async (userId: number, amount: number) => {
  const data = await UserModel.findOneAndUpdate({ userId }, { amount }, { upsert: true, new: true }).select('amount')
  return data.amount
}

export const amountCheckDB = async (userId: number) => {
  const data = await UserModel.findOne({ userId })
  return data
}

export const airdrop = async (userId: number) => {
  // web3 airdrop -> get txhash
  const data = '0xae833772b424beb49d987af5f8dd6049cf5bb57d272e319577b31c0ef63d1643'
  return data
}
