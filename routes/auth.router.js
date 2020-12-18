'use strict'

const express = require('express')
const router = express.Router()
const UserController = require('../controllers/user.controller')
const bcrypt = require('bcrypt')
const saltRounds = 10
const passport = require('passport')
const initializePassport = require('../config/passport.setup')
const flash = require('express-flash')
const session = require('express-session')

initializePassport(passport)

router.use(flash())
router.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
)
router.use(passport.initialize())
router.use(passport.session())

router.post('/register', async (req, res) => {
  if (req.body.password === req.body.confPassword) {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, saltRounds)
      const user = {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      }
      const userController = await UserController()
      if ((await userController.findOrCreate(user)) === null) {
        res.redirect('/verification')
      } else {
        res.render('pages/register.ejs', {
          title: 'Register',
          errors: ['Already a user with that email']
        })
      }
    } catch (err) {
      console.log(err)
      res.render('pages/register.ejs', {
        title: 'Register',
        errors: ['Something went wrong, try again later']
      })
    }
  } else {
    res.render('pages/register.ejs', {
      title: 'Register',
      errors: ['Passwords do not match']
    })
  }
})

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
  })
)

module.exports = router
