import TelegramBot, { SendMessageOptions } from "node-telegram-bot-api";
import * as budget from "./budget";
import dotenv from 'dotenv'
dotenv.config()

const opts: SendMessageOptions = {
    reply_markup: {
        keyboard: [
            [
                {
                    text: "Check My Balance",
                },
            ],
            [
                {
                    text: "Add Income",
                },
                {
                    text: `Add Expense`,
                },
            ],
            [
                {
                    text: "Show Transaction",
                },

            ]
        ],
    },
    parse_mode: "Markdown"
}

const options = {
    webHook: {
        port: 8080
    }
};

const token: string = (process.env.TOKEN as string);

export const bot: TelegramBot = new TelegramBot(token, options)

type handler = { text: string; chat: { id: TelegramBot.ChatId; } }

bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    if (msg?.from?.username) {
        let username = msg?.from?.username;
        if (await budget.checkUser(username)) {
            await bot.sendMessage(chatId, `Welcome back @${username}`, opts);
            return;
        }
        else {
            await budget.createUser(msg?.from?.username);
            await bot.sendMessage(chatId, `Welcome to your budget tracker ${msg?.from?.username}`, opts);
        }
    }
    else {
        await bot.sendMessage(chatId, `It seems you have not set your username in telgram, please set it and try again`);
    }
});

bot.onText(/Check My Balance/, async (msg) => {
    const chatId = msg.chat.id;
    try {
        if (msg?.from?.username) {
            await bot.sendMessage(chatId, `Your balance is ${await budget.showBalance(msg?.from?.username)}`);
        }
        else {
            await bot.sendMessage(chatId, `You should start with /start`);
        }
    }
    catch {
        await bot.sendMessage(chatId, `You should start with /start`);
    }
});


bot.onText(/Add Expense/, async (msg) => {
    let listenerReply: any;
    let username: string;
    if (msg?.from?.username) {
        username = msg?.from?.username;
    }
    let contentMessage = await bot.sendMessage(msg.chat.id, "Enter the amount and note ", {
        "reply_markup": {
            "force_reply": true
        }
    });
    listenerReply = (async (replyHandler: handler) => {
        bot.removeReplyListener(listenerReply);
        if (replyHandler.text === "/cancel") {
            await bot.sendMessage(replyHandler.chat.id, "Canceled", opts);
            return;
        }
        if (replyHandler?.text) {
            let amount = parseInt(replyHandler.text.split(" ")[0]);
            if (isNaN(amount)) {
                await bot.sendMessage(replyHandler.chat.id, "Please enter a number", opts);
                return;
            }
            let description = replyHandler.text.split(" ").splice(1).join(" ");
            let descriptionMsg = description == "" ? "Expense added with no note" : `Expense has been added with note \`${description}\``
            await budget.addExpense(username, amount, description);

            await bot.sendMessage(replyHandler.chat.id, descriptionMsg, opts);
        }

    });
    bot.onReplyToMessage(contentMessage.chat.id, contentMessage.message_id, listenerReply);

});

bot.onText(/Add Income/, async (msg) => {
    let listenerReply: any;
    let username: string;
    if (msg?.from?.username) {
        username = msg?.from?.username;
    }
    let contentMessage = await bot.sendMessage(msg.chat.id, "Enter the amount and note ", {
        "reply_markup": {
            "force_reply": true
        }
    });
    listenerReply = (async (replyHandler: handler) => {
        bot.removeReplyListener(listenerReply);
        if (replyHandler.text === "/cancel") {
            await bot.sendMessage(replyHandler.chat.id, "Canceled", opts);
            return;
        }
        if (replyHandler.text) {
            let amount = parseInt(replyHandler.text.split(" ")[0]);
            if (isNaN(amount)) {
                await bot.sendMessage(replyHandler.chat.id, "Please enter a number", opts);
                return;
            }
            let description = replyHandler.text.split(" ").splice(1).join(" ");
            let descriptionMsg = description == "" ? "Income added with no note" : `Income has been added with note \`${description}\``
            await budget.addIncome(username, amount, description);

            await bot.sendMessage(replyHandler.chat.id, descriptionMsg, opts);
        }
    });
    bot.onReplyToMessage(contentMessage.chat.id, contentMessage.message_id, listenerReply);

});

bot.onText(/Show Transaction/, async (msg) => {
    let username = msg?.from?.username ? msg?.from?.username : "";
    try {
        if (username === "") {
            await bot.sendMessage(msg.chat.id, "You should start with /start");
        }
        else {
            let transactions = await budget.showTransaction(username);
            let jsonData = transactions;
            let markdownTable = `| Type | Amount | Note |\n| ---- | ------ | ---- |\n`;
            for (let key in jsonData) {
                markdownTable += `| ${jsonData[key].type} | ${jsonData[key].amount} | ${jsonData[key].description} |\n`;
            }

            await bot.sendMessage(msg.chat.id, `\`${markdownTable}\``, opts);
        }
    }
    catch (e) {
        console.log(e)
        await bot.sendMessage(msg.chat.id, "You have not entered any transaction yet");
    }
});