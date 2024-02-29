import * as web3 from '@solana/web3.js'
import fs from 'fs';

interface Iuser {
    [key: string]: {
        privateKey: string,
        publicKey: string,
    }
}

const userPath = `./user.json`
const userData: Iuser = JSON.parse(fs.readFileSync(userPath, `utf8`));

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

const createWallet = (chatId: number) => {
    const newKepair = new web3.Keypair();
    const pubkey = newKepair.publicKey.toString();
    const privkey = newKepair.secretKey.toString();

    if (!(chatId.toString() in userData)) {
        userData[chatId] = {
            privateKey: privkey,
            publicKey: pubkey,
        }
        writeData(userData, userPath)
    }

    return pubkey.toString()
}

const init = () => {
    
}



export const welcome = (userId: number) => {
    const title = "Welcome to HonestBot\n\nTo get started with trading, send some SOL to your bonkbot wallet address:\n\n<code>Hello world!</code> (tap to copy)\n\nOnce done tap refresh and your balance will appear here.\n\n"

    const content = [
        [{ text: `Buy`, callback_data: 'buy' }, { text: `Sell`, callback_data: 'sell' }],
        [{ text: `Help`, callback_data: 'help' }, { text: `Refer Friend`, callback_data: 'refer' }],
        [{ text: `Wallet`, callback_data: 'wallet' }, { text: `Settings`, callback_data: 'settings' }],
        [{ text: `Pin`, callback_data: 'pin' }, { text: `Refresh`, callback_data: 'refresh' }],
    ]

    return {
        title, content
    }
}