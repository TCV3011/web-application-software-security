'use strict'

const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  } else {
    res.redirect('/login')
  }
}
const checkNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect('/dashboard')
  } else {
    next()
  }
}

module.exports = { checkAuthenticated, checkNotAuthenticated }
