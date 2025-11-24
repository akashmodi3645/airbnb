module.exports.isLoggedIn = (req,res,next)=>{
     if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl
        req.flash("error", "you must logged in to create new listening")
       return  res.redirect("/login")
     }
     next()
}

module.exports.saveRedirecturl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
  next()
}