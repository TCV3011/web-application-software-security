'use strict'

const checkAuthenticated = (req, res, next) => {
  console.log(req.isAuthenticated())
  if (req.isAuthenticated()) {
    return next()
  } else {
    res.redirect('/login')
  }
}

module.exports = { checkAuthenticated }
