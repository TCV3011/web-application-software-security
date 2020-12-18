'use strict'

const mysql = require('mysql2/promise')

module.exports = async () => {
  try {
    const db = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    })
    return Object.freeze({
      getPromiseConnection: () => {
        return db
      }
    })
  } catch (err) {
    console.log(err)
    return null
  }
}
