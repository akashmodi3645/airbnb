const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user.js")
const passport = require("passport");
const { saveRedirecturl } = require("../middelware.js");
const router = express.Router()
const userController = require("../controllers/user.js")

router.route("/signup").get( userController.renderSignup ).post( userController.signUp)

router.route("/login").get( userController.renderLogin).post( saveRedirecturl, passport.authenticate('local', { failureRedirect: '/login',failureFlash :true }) , userController.Login)


router.get("/logout", userController.LogOut)
module.exports = router