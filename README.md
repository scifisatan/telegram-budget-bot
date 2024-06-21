# Telegram Budget Tracker
Rather than having a separate budget tracking app, I made a budget tracker that can be controlled through telegram, a messaging platform I use on a daily basis.

## Setup
1. Clone this repository.
2. Spin up an instance of PostgresSql database and enter the url in .env file.
3. Create a telegram bot in @BotFather and paste the token in .env file again.
4. Your .env file should look something like this =>
```
DATABASE_URL = {URL}
TOKEN = {TOKEN}
```
Note: You can aslo use the file `budget.ts` if you can't run a database server by using local json file as your database. Modify the codebase accordingly.

## Usage
To start interacting with the bot simply run this command after setup
```javascript
npm install && npm run start
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.


## License

[MIT](https://choosealicense.com/licenses/mit/)
