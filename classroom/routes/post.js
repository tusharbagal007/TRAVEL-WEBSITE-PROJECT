const express= require("express");
const app= express();
const router= express.Router();


//POSTS ROUTES

//Index route for posts
router.get("/",(req,res)=>{
    res.send("GET for post");
})

//Show posts
router.get("/:id",(req,res)=>{
    res.send("GET for post's id");
})

//POST - posts

router.get("/",(req,res)=>{
    res.send("POST for post");
})


//DELETE- users

router.delete("/:id",(req,res)=>{
    res.send("DELETE for post");
})

module.exports= router;