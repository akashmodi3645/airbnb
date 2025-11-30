const listen = require("../models/listening")
const review = require("../models/review")

module.exports.createReview = async (req,res)=>{
      let{id} = req.params
      console.log(id)
      let liss =   await listen.findById(req.params.id)
      
      let newrev = new review( req.body.review)
      newrev.author = req.user._id
      liss.reviews.push(newrev)
      await newrev.save()
      await liss.save()
req.flash("success", "new review created")
      res.redirect(`/listening/${liss.id}`)
}

module.exports.deletRoute = async(req,res)=>{
    let {id , reviewid}  = req.params
    await listen.findByIdAndUpdate(id , {$pull : {reviews : reviewid}})
    await review.findByIdAndDelete(reviewid)
    req.flash("success", " review deleted succesfully")
    res.redirect( `/listening/${id}`)

}