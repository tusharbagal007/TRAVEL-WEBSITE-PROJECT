const express= require("express");
const app= express();
const users= require("./routes/user.js");
const posts= require("./routes/post.js");
const cookieParser= require("cookie-parser");
const session= require("express-session");
const flash= require("connect-flash");
const path= require("path");

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");

const sessionOptions= {
secret:"mysupersecretstring",
resave:false,
saveUninitialized:true
};

app.use(session(sessionOptions));
app.use(flash());


app.get("/register",(req,res)=>{
    let {name="anonymous"}= req.query;
    req.session.name= name;
    req.flash("success","User registered successfully");
    res.redirect("/hello");
})


app.get("/hello",(req,res)=>{
    res.locals.messages= req.flash("success");
    res.render("page.ejs",{name:req.session.name});
})



app.get("/test",(req,res)=>{
    res.send("test successfull");
})


// app.get("/reqcount",(req,res)=>{

//     if(req.session.count){
//         req.session.count++;
//     }
//     else{
//         req.session.count=1;
//     }
    

//     res.send(`You send the request ${req.session.count} times`);
// })


app.listen(3000,()=>{
    console.log("Server is listening to port:3000");
})