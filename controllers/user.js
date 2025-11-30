const User = require("../models/user")

module.exports.renderSignup = (req,res)=>{
    res.render("user/form.ejs")
}

module.exports.signUp = (async(req,res)=>{
try{
    console.log(req.body)
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
})

module.exports.renderLogin = (req,res)=>{
    res.render("user/login.ejs")
}

module.exports.Login = async(req,res)=>{
      
    req.flash("success" , "welcome back to wanderlust")
    let redirect  = res.locals.redirectUrl  || "/listening"
       res.redirect(redirect)
}
module.exports.LogOut = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
         return   next(err)
        }
        req.flash("success"," you logged out succesfully")
        res.redirect("/listening")
    })
}