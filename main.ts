import { Request, Response } from "express"
import { bot } from './bot'
import dotenv from 'dotenv'
import express from 'express'
const app = express()
app.use(express.json());
dotenv.config()

const url = process.env.URL
export const token = process.env.TOKEN

app.get('/', (req: Request, res: Response) => {
    res.send('Hello sdfdsfd!')
})

app.post(`/bot${token}`, async (req: Request, res: Response) => {
    bot.processUpdate(req.body);
    res.send('Hello Bot!')
})

app.listen(process.env.PORT||3001, async () => {
    await bot.setWebHook(`${url}/bot${token}`);
    console.log("bot is listening")
})
