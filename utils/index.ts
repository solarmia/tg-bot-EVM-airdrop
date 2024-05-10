export const validatorAddr = (address: string) => {
    return /^0x[0-9a-fA-F]{40}$/.test(address)
}

export const waitFor = (delay: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, delay));
};
