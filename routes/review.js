const express = require("express")
const router = express.Router({mergeParams : true})
 const { reviewSchema} = require("../schema.js")
 const wrapAsync = require("../utils/wrapAsync.js")
 const expressError = require("../utils/expressError.js")
 const listen = require("../models/listening.js")
  const review  = require("../models/review.js")

 
 
 const validatereview = (req,res,next)=>{
     const {error} = reviewSchema.validate(req.body)
   
    if(error){
     let errMsg =  error.details.map((el)=>el.message).join(",")
     throw new expressError(400, error)
    }else{
     next()
    }
 }

router.post("/", validatereview , wrapAsync( async (req,res)=>{
      let liss =   await listen.findById(req.params.id)
      
      let newrev = new review( req.body.review)
      liss.reviews.push(newrev)
      await newrev.save()
      await liss.save()
req.flash("success", "new review created")
      res.redirect(`/listening/${liss.id}`)
}))

router.delete("/:reviewid", wrapAsync(async(req,res)=>{
    let {id , reviewid}  = req.params
    await listen.findByIdAndUpdate(id , {$pull : {reviews : reviewid}})
    await review.findByIdAndDelete(reviewid)
    req.flash("success", " review deleted succesfully")
    res.redirect( `/listening/${id}`)

}))

module.exports = router