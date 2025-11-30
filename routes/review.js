const express = require("express")
const router = express.Router({mergeParams : true})
 const { reviewSchema} = require("../schema.js")
 const wrapAsync = require("../utils/wrapAsync.js")
 const expressError = require("../utils/expressError.js")
 const listen = require("../models/listening.js")
  const review  = require("../models/review.js")
const { isLoggedIn ,isreviewAuthor } = require("../middelware.js")
const reviewController = require("../controllers/reviews.js")

 
 
 const validatereview = (req,res,next)=>{
     const {error} = reviewSchema.validate(req.body)
   
    if(error){
     let errMsg =  error.details.map((el)=>el.message).join(",")
     throw new expressError(400, error)
    }else{
     next()
    }
 }

router.post("/", isLoggedIn, validatereview , wrapAsync( reviewController.createReview))

router.delete("/:reviewid",isLoggedIn,isreviewAuthor, wrapAsync(reviewController.deletRoute))

module.exports = router