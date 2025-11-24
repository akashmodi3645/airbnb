const express = require("express")
const router = express.Router({mergeParams : true})
 const {listeningSchema } = require("../schema.js")
 const wrapAsync = require("../utils/wrapAsync.js")
 const expressError = require("../utils/expressError.js")
 const listen = require("../models/listening.js")
 const {isLoggedIn} = require("../middelware.js")



const validatelistening = (req,res,next)=>{
    const {error} = listeningSchema.validate(req.body)
  
   if(error){
    let errMsg =  error.details.map((el)=>el.message).join(",")
    throw new expressError(400, error)
   }else{
    next()
   }
}

router.get("/", wrapAsync(async(req,res)=>{
    let alllisten = await listen.find();
    res.render("listening/listen.ejs",{alllisten})
}))

router.get("/new", isLoggedIn,(req,res)=>{
   
    res.render("listening/create.ejs")
})
router.get("/:id", wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listendata =  await listen.findById(id).populate("reviews")
    if(!listendata){
         req.flash("error", "listening you requested for does not exit ")
         res.redirect("/listening")
    }else{
        res.render("listening/show.ejs",{listendata})
    }
   
    
}))


router.post("/", isLoggedIn, validatelistening,  wrapAsync(async(req,res)=>{
    
  
     let listens =  new listen(req.body.listens)
     await listens.save()
     req.flash("success", "new listening created")
    // console.log(listening)
    res.redirect("/listening")
        
    
   
}))
router.get("/:id/edit", isLoggedIn, wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let data = await listen.findById(id)
     if(!data){
         req.flash("error", "listening you requested for does not exit ")
         res.redirect("/listening")
    }else{
res.render("listening/edit.ejs",{data})
    }
    
    // console.log(data)
}))
//edit route

router.put("/:id", isLoggedIn, validatelistening , wrapAsync(async(req,res)=>{
   
    let {id} = req.params;

      
 await listen.findByIdAndUpdate(id,{...req.body.listens})
 req.flash("success", " listening edit")
 res.redirect(`/listening/${id}`)


}))
router.delete("/:id",isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;

    console.log("ID:", id);

    const deleteddata = await listen.findByIdAndDelete(id)

    console.log("DELETED:", deleteddata);

    req.flash("success", "Listening deleted successfully");

    return res.redirect("/listening");
}));


module.exports = router
