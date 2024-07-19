/** Common config for bookstore. */
require('dotenv').config();

const DB_USER = process.env.DB_USERNAME;
const DB_PW = process.env.DB_PASSWORD;

let DB_URI = `postgresql://${DB_USER}:${DB_PASSWORD}@localhost`;

if (process.env.NODE_ENV === "test") {
  DB_URI = `${DB_URI}/books_test`;
} else {
  DB_URI = process.env.DATABASE_URL || `${DB_URI}/books`;
}


module.exports = { DB_URI };