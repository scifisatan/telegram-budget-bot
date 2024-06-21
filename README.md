## Live Preview: https://t.me/coolbudgetbot 
#### Don't have a database so data doesn't persist rn :( 

# Telegram Budget Tracker
Rather than having a separate budget tracking app, I made a budget tracker that can be controlled through telegram, a messaging platform I use on a daily basis.
Having a budget tracker inside my messaging app allowed me to reduce friction between me and my money management

## Screenshots
|                       |                   |
| :-------------------------: | :------------------------: |
|  ![Screenshot 2024-06-21 191140](https://github.com/scifisatan/telegram-budget-bot/assets/60970080/9c35ff40-292c-41b9-b2c2-f0167ddb6ea5) | ![Screenshot 2024-06-21 191233](https://github.com/scifisatan/telegram-budget-bot/assets/60970080/47f7cdd4-b89f-47f2-bc52-a721a3ec2fcb) |


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
## Future Improvements:
- A web app to interact and modify your transactions easily.
- Charts and graphs on web app
- Improved UX to add income and expense through telegram
  
## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.


## License

[MIT](https://choosealicense.com/licenses/mit/)
