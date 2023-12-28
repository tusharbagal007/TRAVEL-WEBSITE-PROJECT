const express= require("express");
const router= express.Router({mergeParams:true});
const wrapAsync= require("../utils/wrapAsync.js");
const ExpressError= require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}= require("../schema.js");
const Review= require("../Models/review.js");
const Listing= require("../Models/listing.js");

const validateReview= ((req,res,next)=>{
    let{error}= reviewSchema.validate(req.body);
    
    if(error){
        throw new ExpressError(400,error);
    }
    else{
        next();
    }
})

//REVIEWS ROUTE

//post review route
router.post("/",wrapAsync(async(req,res)=>{
    
    let listing=await Listing.findById(req.params.id);
    let{rating,comment}= req.body;
    let newReview= new Review({
     rating:rating,
     Comment:comment,
    });
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
 
 
    req.flash("success","New review created!");
    res.redirect(`/listings/${listing.id}`)
 }));
 
 
 
 //DELETE REVIEW ROUTE
 router.delete("/:reviewId",wrapAsync(async(req,res)=>{
 
 let {id, reviewId}= req.params;
 await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
 await Review.findByIdAndDelete(reviewId);
 
 req.flash("success","Review Deleted!");
 res.redirect(`/listings/${id}`);
 
 }))


 module.exports= router;