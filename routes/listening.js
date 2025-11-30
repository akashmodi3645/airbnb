
if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express")
const router = express.Router({mergeParams : true})
 const {listeningSchema } = require("../schema.js")
 const wrapAsync = require("../utils/wrapAsync.js")
 const expressError = require("../utils/expressError.js")
 const listen = require("../models/listening.js")
 const {isLoggedIn , isOwner} = require("../middelware.js")
 const listeningController = require("../controllers/listening.js")
 const multer  = require('multer')
 const {storage} = require("../cloudConflig.js")
const upload = multer( {storage})



const validatelistening = (req,res,next)=>{
    const {error} = listeningSchema.validate(req.body)
  
   if(error){
    let errMsg =  error.details.map((el)=>el.message).join(",")
    throw new expressError(400, error)
   }else{
    next()
   }
}
router.route("/")
.get( wrapAsync(listeningController.index))
.post( isLoggedIn,upload.single('listens[image][url]'), validatelistening,  wrapAsync(listeningController.createnewListing))


router.get("/new", isLoggedIn, listeningController.renderNewForm)

router.route("/:id").get( wrapAsync(listeningController.showListening)).put( isLoggedIn,isOwner,upload.single('listens[image][url]'), validatelistening , wrapAsync(listeningController.editListening)).delete(isLoggedIn, wrapAsync(listeningController.deleteListening));



router.get("/:id/edit", isLoggedIn, wrapAsync(listeningController.renderEditForm))
//edit route

module.exports = router
