'use strict'

const express = require('express')
const router = express.Router()
const UserController = require('../controllers/user.controller')
const bcrypt = require('bcrypt')
const saltRounds = 10
const flash = require('express-flash')
const session = require('express-session')
const {
  checkAuthenticated,
  checkNotAuthenticated,
  sendEmail
} = require('../middleware')
const passport = require('passport')
const initializePassport = require('../config/passport.setup')
const port = process.env.APP_PORT
const URL = process.env.APP_URL
const { validationResult, check } = require('express-validator')
const sha1 = require('sha1')
const zlib = require('zlib')
var request = require('request')

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

router.get('/', (req, res) => {
  res.render('index.ejs', { title: 'Home' })
})

router.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('pages/login.ejs', { title: 'Login' })
})

router.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('pages/register.ejs', { title: 'Register', errors: [] })
})

router.post('/register', checkNotAuthenticated, async (req, res) => {
  await check('fName', 'First name must be filled in')
    .exists()
    .notEmpty()
    .run(req)
  await check('lName', 'Last name must be filled in')
    .exists()
    .notEmpty()
    .run(req)
  await check('email', 'Email must be a valid email address')
    .exists()
    .notEmpty()
    .normalizeEmail()
    .isEmail()
    .run(req)
  await check('password', 'Password must be at least 7 characters long')
    .exists()
    .isLength({ min: 7 })
    .run(req)
  await check(
    'confPassword',
    'Password confirmation must have the same value as the password'
  )
    .exists()
    .isLength({ min: 7 })
    .custom((value, { req }) => value === req.body.password)
    .run(req)
  await check('consentReg').exists({ checkFalsy: true }).run(req)

  const result = validationResult(req)
  if (!result.isEmpty()) {
    console.log(result.array())
    res.render('pages/register.ejs', {
      title: 'Register',
      errors: result.array()
    })
  } else {
    try {
      /**
       * based on https://samwize.com/2014/05/27/node-dot-js-request-module-with-gzip-slash-gunzip/
       */
      let shaString = sha1(req.body.password)
      let prefix = shaString.substring(0, 5)
      let suffix = shaString.substring(5, shaString.length)
      var options = {
        method: 'GET',
        url: `https://api.pwnedpasswords.com/range/${prefix}`,
        headers: {
          'Accept-Encoding': 'gzip, deflate'
        },
        encoding: null
      }
      let breached = false
      let hashesString = ''
      request(options, async () => {
        let readableData = hashesString.toString('utf-8')
        let hashes = readableData.split('\n')

        for (let i = 0; i < hashes.length; i++) {
          let hash = hashes[i]
          let h = hash.split(':')
          if (h[0] === suffix.toUpperCase() && h[1] >= 300) {
            breached = true
            break
          }
        }

        console.log(breached)
        if (breached === true) {
          res.render('pages/register.ejs', {
            title: 'Register',
            errors: [
              {
                msg:
                  'Password is known to be breached (more than) 300 times. Please consider using another password'
              }
            ]
          })
        } else {
          const hashedPassword = await bcrypt.hash(
            req.body.password,
            saltRounds
          )
          const user = {
            name: req.body.fName.concat(' ', req.body.lName),
            email: req.body.email,
            password: hashedPassword
          }
          const userController = await UserController()
          if ((await userController.findOrCreate(user)) === null) {
            // authenticate user and redirect to verification
            passport.authenticate('local')(req, res, function () {
              sendEmail(
                user.email,
                'Verify your email',
                `Please click the button below to verify your email address.
  
                    <a href="http://${URL}:${port}/auth/verify?uId=${req.user.id}">Verify your email</a>
  
                    If you did not create an account, no further action is required.
  
                    Regards,
                    Tycho Verstraete`
              )
              res.redirect('/verification')
            })
          } else {
            res.render('pages/register.ejs', {
              title: 'Register',
              errors: [
                {
                  msg: 'Already a user with that email'
                }
              ]
            })
          }
        }
      })
        .pipe(zlib.createGunzip()) // unzip
        .on('data', (data) => {
          hashesString = hashesString.concat('\n', data)
        })
    } catch (err) {
      console.log(err)
      res.render('pages/register.ejs', {
        title: 'Register',
        errors: [
          {
            msg: 'Something went wrong, try again later'
          }
        ]
      })
    }
  }
})

router.get('/verification', (req, res) => {
  res.render('pages/verification.ejs', { title: 'Verification' })
})

router.get('/dashboard', checkAuthenticated, (req, res) => {
  res.render('pages/dashboard.ejs', { title: 'Dashboard', name: req.user.name })
})

router.get('/profile', checkAuthenticated, (req, res) => {
  res.render('pages/profile.ejs', { title: 'Profile', name: req.user.name })
})

router.get('/privacy-policy', (req, res) => {
  res.render('pages/privacy-policy.ejs', { title: 'Privacy policy' })
})

module.exports = router
