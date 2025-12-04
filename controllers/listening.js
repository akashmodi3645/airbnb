const express = require("express")
const app = express()
const listen = require("../models/listening.js")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async(req,res)=>{
    let alllisten = await listen.find();
    res.render("listening/listen.ejs",{alllisten})
}
module.exports.renderNewForm  = (req,res)=>{
   
    res.render("listening/create.ejs")
}

module.exports.showListening = async(req,res)=>{
    let {id} = req.params;
  const listendata = await listen.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
      console.log(listendata)
    if(!listendata){
         req.flash("error", "listening you requested for does not exit ")
         res.redirect("/listening")
    }else{
        res.render("listening/show.ejs",{listendata})
    }
}

module.exports.createnewListing = async(req,res)=>{

   let response =  await geocodingClient.forwardGeocode({
  query: req.body.listens.location,
  limit: 1
})
  .send()
 
 
    let url = req.file.path
    let filename = req.file.filename
     let listens =  new listen(req.body.listens)
     listens.owner = req.user._id
     listens.image = {url , filename}
     listens.geometry = response.body.features[0].geometry

     await listens.save()
     req.flash("success", "new listening created")
    // console.log(listening)
    res.redirect("/listening")
}

module.exports.renderEditForm = async(req,res)=>{
    let {id} = req.params;
    let data = await listen.findById(id)
     if(!data){
         req.flash("error", "listening you requested for does not exit ")
         res.redirect("/listening")
    }else{
         const OriginalImageUrl = data.image.url
         OriginalImageUrl.replace = ("/upload" , "/upload/h_300 ,w_250")
res.render("listening/edit.ejs",{data})
    }
    // console.log(data)
}

module.exports.editListening = async(req,res)=>{
    let {id} = req.params;
    console.log(req.body)
  let listens =  await listen.findByIdAndUpdate(id,{...req.body.listens},{ new: true })
  if(typeof req.file !== "undefined"){
    let url = req.file.path
    let filename = req.file.filename
     listens.image = {url , filename}
     await listens.save()
  }
 req.flash("success", " listening edit")

 res.redirect(`/listening/${id}`)
}


module.exports.deleteListening = async (req, res) => {
    const { id } = req.params;

    console.log("ID:", id);

    const deleteddata = await listen.findByIdAndDelete(id)

    console.log("DELETED:", deleteddata);

    req.flash("success", "Listening deleted successfully");

    return res.redirect("/listening");
}
module.exports.index = async (req, res) => {
  try {
    const { location } = req.query;        // ?location=shimla
    let filter = {};

    if (location && location.trim() !== "") {
      const loc = location.trim();

      // agar schema me "location" field hai:
      filter.location = { $regex: loc, $options: "i" };

      // agar tum city/country alag fields rakhte ho to yeh use karo:
      /*
      filter = {
        $or: [
          { city:    { $regex: loc, $options: "i" } },
          { country: { $regex: loc, $options: "i" } },
        ],
      };
      */
    }

    const alllisten = await listen.find(filter);
    res.render("listening/listen.ejs", { alllisten, location });
  } catch (err) {
    console.log(err);
    req.flash("error", "Unable to load listings");
    res.redirect("/");
  }
};


