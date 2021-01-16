'use strict'

const DbSetup = require('../config/db.setup')

module.exports = async () => {
  const dbSetup = await DbSetup()
  try {
    const conn = dbSetup.getPromiseConnection()
    const safeQuery = async (query, params) => {
      if (params) {
        try {
          const [rows, fields] = await conn.query(query, params)
          return rows
        } catch (err) {
          console.log(err)
          return null
        }
      } else {
        try {
          const [rows, fields] = await conn.query(query)
          return rows
        } catch (err) {
          console.log(err)
          return null
        }
      }
    }

    const convertToSingleUser = (rows) => {
      if (rows === undefined || rows.length == 0) {
        return null
      } else {
        let user = {
          id: rows[0].id,
          name: rows[0].name,
          email: rows[0].email,
          password: rows[0].password,
          email_verified: rows[0].email_verified,
          remember_token: rows[0].remember_token,
          created_at: rows[0].created_at
        }
        return user
      }
    }

    const findUserByEmail = async (email) => {
      const rows = await safeQuery('SELECT * FROM users WHERE email = ?', email)
      return convertToSingleUser(rows)
    }

    const findUserById = async (id) => {
      const rows = await safeQuery('SELECT * FROM users WHERE id = ?', id)
      return convertToSingleUser(rows)
    }

    const findOrCreateUser = async (user) => {
      if ((await findUserByEmail(user.email)) !== null) {
        return user
      } else {
        safeQuery(
          'INSERT INTO users (name, email, password, email_verified, remember_token, created_at) VALUES (?, ?, ?, ?, ?, ?)',
          [
            user.name,
            user.email,
            user.password,
            null,
            'remember_token',
            new Date().toISOString().slice(0, 19).replace('T', ' ')
          ]
        )
        return null
      }
    }

    const db = {
      test: async () => {
        return await safeQuery('SELECT 1')
      },
      findByEmail: async (email) => {
        return await findUserByEmail(email)
      },
      findOrCreate: async (user) => {
        return await findOrCreateUser(user)
      },
      findById: async (id) => {
        return await findUserById(id)
      }
    }

    return Object.freeze(db)
  } catch (err) {
    console.log(err)
    return null
  }
}
