import UserModel from "../utils/model"

export const start = async (userId: number, username?: string) => {
  const info = await UserModel.findOneAndUpdate({ userId }, { userId, username: username }, { upsert: true })
}

export const addressCheckDB = async (userId: number, new_address?: string) => {
  if (new_address) {
    const data = await UserModel.findOneAndUpdate({ userId }, { address: new_address }, { new: true, upsert: true }).select('address')
    return data.address
  } else {
    const data = await UserModel.findOne({ userId }).select('address')
    return data ? data.address ?? '' : ''
  }
}

export const amountCheckDB = async (userId: number, amount: number) => {
  const data = await UserModel.findOneAndUpdate({ userId }, { amount: amount }, { upsert: true, new: true }).select('amount')
  return data.amount
}