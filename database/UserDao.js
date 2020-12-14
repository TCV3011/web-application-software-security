'use strict'

const dbBase = require('./db_base')

class UserDao extends dbBase {
  constructor(props) {
    super(props)
    this.conn = super.getPromiseConnection()
  }

  test = async () => {
    const [rows, fields] = await this.conn.query('SELECT 1')

    return rows[0]
  }

  getUsers = async () => {
    const [rows, fields] = await this.conn.query('SELECT * FROM users')
    return rows
  }

  registerUser = async (user) => {
    this.conn.query(
      'INSERT INTO users (name, email, password, email_verified, remember_token, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [
        user.name,
        user.email,
        user.password,
        false,
        user.remember_token,
        new Date().toISOString().slice(0, 19).replace('T', ' ')
      ],
      (err, result) => {
        console.log(err)
      }
    )
  }
}

module.exports = UserDao
