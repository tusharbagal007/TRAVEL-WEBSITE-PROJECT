const express= require("express");
const app= express();
const port= 8080;
const Listing= require("./Models/listing.js");
const data= require("./init/data.js");
const methodOverride= require("method-override");
const ejsMate= require("ejs-mate");
const wrapAsync= require("./utils/wrapAsync.js");
const ExpressError= require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}= require("./schema.js");
const Review= require("./Models/review.js");
const session= require("express-session");
const flash= require("connect-flash");
const passport= require("passport");
const localStrategy= require("passport-local");
const User= require("./Models/user.js");



const listings= require("./routes/listing.js");
const reviews= require("./routes/review.js");

const path= require("path");
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const mongoose = require('mongoose');
const review = require("./Models/review.js");


const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveunitialized:true,
    cookie:{
        expires:Date.now()+ 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,
    }
};


app.get("/",(req,res)=>{
    res.send("Get request is working");
})


app.use(session(sessionOptions));
app.use(flash());








main().then(()=>{
    console.log("connected to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}



app.use((req,res,next)=>{
    res.locals.success= req.flash("success");
    res.locals.error= req.flash("error");
    next();
})





app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);


const validateListing= ((req,res,next)=>{
    let{error}= listingSchema.validate(req.body);
    
    if(error){
        throw new ExpressError(400,error);
    }
    else{
        next();
    }
});



app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
})


app.use((err,req,res,next)=>{
    let{status=500,message="Something went wrong"}= err;
    res.render("error.ejs",{message});
})



app.listen(port,()=>{
    console.log(`Server is listening to port:${port}`)
})

