/**
 * UserDao.js
 * author: Tycho Verstraete
 * date: 29/11/2020
 */
'use strict'

const UserDao = require('../database/UserDao')

class UserController extends UserDao {
  constructor(props) {
    super(props)
  }

  saveToDatabase = async (user) => {
    await super.registerUser(user)
  }
}

module.exports = UserController
