const express = require("express")
const app = express()
const mongoose = require("mongoose")

const path = require("path")
 const methodOverride = require('method-override')
  const ejsMate = require("ejs-mate");
  const expressError = require("./utils/expressError.js")
  const listeningRouter = require("./routes/listening.js")
  const reviewsRouter = require("./routes/review.js")
  const session = require("express-session")
  const MongoStore = require('connect-mongo');
  const flash = require("connect-flash")
  const passport = require("passport")
  const LocalStrategy = require("passport-local")
  const User = require("./models/user.js")
  const userRouter = require("./routes/user.js")

app.set("view engine","ejs")
app.set("views", path.join(__dirname,"views"))
app.use(express.urlencoded({extended : true}))
app.use(express.json())
app.use(methodOverride('_method'))
app.engine("ejs", ejsMate)
app.use(express.static(path.join(__dirname,"public")))
   



const dbUrl = process.env.ATLASDB_URL
main().then(res=>{
    console.log("connect succsfully")
}).catch(err=>{
    console.log(err)
})
async function main(){
    await mongoose.connect(dbUrl)
}
 const store =  MongoStore.create({
    mongoUrl:dbUrl,
    secret: "mysecretcode",
    touchAfter: 24 * 3600
   })
 const sessionOption = {
    store,
    secret : "mysecretcode",
    resave : false,
  saveUninitialized: true,
  cookie : {
    expire : Date.now()+7*24*60*60*1000,
    maxAge : 7*24*60*60+1000,
    httpOnly : true
  }
  }
  store.on("error",(err)=>{
    console.log("error in mongo session store",err)
  })

//  app.get("/",(req,res)=>{
//     res.send("hiii")

//  })
 app.use(session(sessionOption))
 app.use(flash())
 app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

 app.use((req,res,next)=>{
    res.locals.success =  req.flash("success")
       res.locals.error =  req.flash("error")
       res.locals.currUser = req.user
    next();
 })

//  app.get("/register",  async(req,res)=>{
//     let fakeuser = new User({
//         email : "akashmodi",
//         username : "akash modi"

//     })
//          let registereduser =  await User.register(fakeuser , "hello")
//          console.log(registereduser)
//          res.send(registereduser)
//  })


 app.use("/listening" , listeningRouter)
 app.use("/listening/:id/review" , reviewsRouter)
 app.use("/" , userRouter)


app.use((req,res,next)=>{
    next(new expressError(404,"page not found"))
})

app.use((err,req,res,next)=>{
    let {status = 500 , message}  = err;
    res.status(status).render("error.ejs",{err})
})


const port = 3000;
app.listen(port,(req,res)=>{
    console.log(`server run at  port ${port}`)
})
