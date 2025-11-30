 const listen = require("./models/listening.js")
 const review = require("./models/review.js")


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

module.exports.isOwner = async(req,res,next)=>{
  let {id} = req.params
  let listening = await listen.findById(id)
  console.log(listening)
  if(!listening.owner.equals(res.locals.currUser._id)){
       req.flash("error" ,"you dont have permision to edit ")
       return res.redirect(`/listening/${id}`)
  }
  next()

}


module.exports.isreviewAuthor = async(req,res,next)=>{
  let { id ,reviewid} = req.params
  let reviews = await review.findById(reviewid)
  console.log(reviews)
  if(!reviews.author.equals(res.locals.currUser._id)){
       req.flash("error" ,"you are not author of this review ")
       return res.redirect(`/listening/${id}`)
  }
  next()

}