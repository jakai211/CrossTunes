import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "CrosstunesDEV",
  password: process.env.DB_PASS || "123",
  database: process.env.DB_NAME || "CrossTunesDB",
});

export default pool;
