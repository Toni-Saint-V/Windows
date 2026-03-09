const dotenv = require("dotenv");
const { createLeadStore } = require("./db");

dotenv.config();

const databasePath = process.env.DATABASE_PATH || "./data/glavzaves.sqlite";
const store = createLeadStore({ databasePath });

console.log(`Database is ready at ${databasePath}`);
store.close();
