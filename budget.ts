interface transactions{
    amount: number;
    type: "income" | "expense";
    description: string;
}
type Transaction = Record<string, transactions>

interface User {
    balance: number;
    transaction: Transaction;
}
// type Usernames = Record<string, User>

import { JsonDB, Config } from 'node-json-db'; 

const database = new JsonDB(new Config("budgetDB", true, true, '/'));

export const createUser = async (username: string) => {
    try {
        await database.push(`/${username}`, { balance: 0, transaction: {} });
       
        console.log("User created");
    }
    catch (error) {
        console.log(error);
    }
}

export const checkUser = async (username: string) => {
    try {
        await database.getData(`/${username}`);
        return true;
    } catch (error) {
        return false;
    } 
}

export const addIncome = async (username: string, income: number, description: string) => {
    const date = new Date().toString();
    const transaction = {
        amount: income,
        type: "income",
        description: description
    }
    const balance: number = await database.getData(`/${username}/balance`);
    await database.push(`/${username}/balance`, balance+income);
    await database.push(`/${username}/transactions/${date}`, transaction);
}


export const addExpense = async (username: string, expense: number, description: string) => {
    const date = new Date().toString();
    const transaction = {
        amount: expense,
        type: "expense",
        description: description
    }
    const balance: number = await database.getData(`/${username}/balance`);
    await database.push(`/${username}/balance`, balance-expense);
    await database.push(`/${username}/transactions/${date}}`, transaction);
}

export const showTransaction = async (username: string) => {
    const transaction:transactions = await database.getData(`/${username}/transactions`);
    return transaction;
}

export const showBalance = async (username: string) => {
    const balance: number = await database.getData(`/${username}/balance`);
    return balance;
}




