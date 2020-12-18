'use strict'

const localStrategy = require('passport-local').Strategy
const UserController = require('../controllers/user.controller')
const bcrypt = require('bcrypt')

const initialize = (passport) => {
  const authenticateUser = async (email, password, done) => {
    const userController = await UserController()
    const user = await userController.findByEmail(email)
    if (user == null) {
      return done(null, false, { message: 'No user found with that email' })
    }
    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password is incorrect' })
      }
    } catch (err) {
      return done(err)
    }
  }
  passport.use(
    new localStrategy(
      {
        usernameField: 'email'
      },
      authenticateUser
    )
  )
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser(async (id, done) => {
    const userController = await UserController()
    return done(null, await userController.findById(id))
  })
}

module.exports = initialize
