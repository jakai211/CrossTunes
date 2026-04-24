import pool from "./pool.js";
import { readCollection, writeCollection } from "./localStore.js";

const usersFile = "users.json";

function isFallbackError(err) {
  return err?.code === "ECONNREFUSED" || err?.code === "PROTOCOL_CONNECTION_LOST" || err?.code === "ER_NO_SUCH_TABLE";
}

export async function findUserByEmail(email) {
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0] || null;
  } catch (err) {
    if (!isFallbackError(err)) {
      throw err;
    }

    const users = await readCollection(usersFile, []);
    return users.find((user) => user.email === email) || null;
  }
}

export async function createUser({ email, firstName, lastName, password }) {
  try {
    const [result] = await pool.query(
      "INSERT INTO users (email, firstName, lastName, password) VALUES (?, ?, ?, ?)",
      [email, firstName, lastName, password]
    );

    return {
      id: result.insertId,
      email,
      firstName,
      lastName,
      password,
    };
  } catch (err) {
    if (err?.code === "ER_DUP_ENTRY") {
      throw err;
    }

    if (!isFallbackError(err)) {
      throw err;
    }

    const users = await readCollection(usersFile, []);

    if (users.some((user) => user.email === email)) {
      const duplicateError = new Error("Duplicate email");
      duplicateError.code = "ER_DUP_ENTRY";
      throw duplicateError;
    }

    const nextId = users.reduce((maxId, user) => Math.max(maxId, Number(user.id) || 0), 0) + 1;
    const nextUser = {
      id: nextId,
      email,
      firstName,
      lastName,
      password,
      created_at: new Date().toISOString(),
    };

    users.push(nextUser);
    await writeCollection(usersFile, users);
    return nextUser;
  }
}