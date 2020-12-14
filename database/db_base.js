/**
 * db_base.js
 * author: Tycho Verstraete
 * date: 29/11/2020
 */
'use strict'

const path = require('path')
const dotenv = require('dotenv').config({
  path: path.join(__dirname, '.env')
})
const mysql = require('mysql2')

class dbBase {
  constructor() {
    try {
      this.connection = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      })
      console.log('Connected to database')
    } catch (err) {
      console.log(err)
    }
  }

  getPromiseConnection() {
    return this.connection.promise()
  }
}

module.exports = dbBase
