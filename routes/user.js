const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user.js")
const passport = require("passport");
const { saveRedirecturl } = require("../middelware.js");
const router = express.Router()

router.get("/signup", (req,res)=>{
    res.render("user/form.ejs")
})

router.post("/signup" ,(async(req,res)=>{
try{
    let {username ,email ,password} = req.body;
let newuser = new User({email , username})
let registereduser =  await User.register(newuser , password)
console.log(registereduser)
req.login(registereduser , (err)=>{
    if(err){
        return next(err);
    }
    req.flash("success" , "welcome to wanderlust")
res.redirect("/listening")
})
}catch(e){
    req.flash("error" , e.message)
    res.redirect("/signup")
}
}))
router.get("/login" ,(req,res)=>{
    res.render("user/login.ejs")
})

router.post("/login", saveRedirecturl, passport.authenticate('local', { failureRedirect: '/login',failureFlash :true }),async(req,res)=>{
      
    req.flash("success" , "welcome back to wanderlust")
    let redirect  = res.locals.redirectUrl  || "/listening"
       res.redirect(redirect)
})


router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
         return   next(err)
        }
        req.flash("success"," you logged out succesfully")
        res.redirect("/listening")
    })
})
module.exports = router