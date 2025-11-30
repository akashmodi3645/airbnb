const mongoose = require("mongoose")
const initdata = require("./data.js")
const listen  = require("../models/listening.js")

 main().then(res=>{
     console.log("connect succsfully")
 }).catch(err=>{
     console.log(err)
 })
 async function main(){
     await mongoose.connect("mongodb://127.0.0.1:27017/airbnb")
 }

 const initdb = async()=>{
   await listen.deleteMany({}).then(res=>{console.log("deleted")})
   initdata.data =  initdata.data.map((obj)=>({...obj , owner : "69256121cc44ec32925da6f8"}))
   await listen.insertMany(initdata.data)
   console.log("saved")
 }
 initdb();