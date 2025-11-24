const express = require("express")
const mongoose = require("mongoose")
const review = require("./review.js")

const schema = mongoose.Schema;


let listenschema = new schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  image: {
    filename: {
      type: String,
      default: "listingimage"
    },
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
    }
  },
  price: {
    type: Number,
    required: true
  },
  location: String,
  country: String,
  reviews: [
    {
      type : schema.Types.ObjectId,
      ref : "review"
    }
  ]
});

listenschema.post("findOneAndDelete" , async(doc)=>{
if(doc){
  await review.deleteMany({_id : {$in : doc.reviews}})
  }

})
  

let listen = mongoose.model("listen", listenschema)

module.exports = listen;