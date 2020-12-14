/**
 * User.js
 * author: Tycho Verstraete
 * date: 29/11/2020
 */
'use strict'

const UserController = require('../controllers/UserController')
const bcrypt = require('bcrypt')
const saltRounds = 10

class User extends UserController {
  constructor(name, email, password) {
    this.name = name
    this.email = email
    this.password = bcrypt.hashSync(password, saltRounds)
    this.emailVerified = false
    this.rememberToken = this.generateToken()
  }
  generateToken = () => {
    return 'token'
  }
}

module.exports = User
