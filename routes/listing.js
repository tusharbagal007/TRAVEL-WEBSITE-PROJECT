const express= require("express");
const router= express.Router();
const wrapAsync= require("../utils/wrapAsync.js");
const {listingSchema,reviewSchema}= require("../schema.js");
const ExpressError= require("../utils/ExpressError.js");
const Listing= require("../Models/listing.js");



const validateListing= ((req,res,next)=>{
    let{error}= listingSchema.validate(req.body);
    
    if(error){
        throw new ExpressError(400,error);
    }
    else{
        next();
    }
});



//Index route

router.get("/",wrapAsync(async (req,res)=>{
    const allListings= await Listing.find();
    res.render("./listings/index.ejs",{allListings});

}));


//New route

router.get("/new",(req,res)=>{
    res.render("./listings/new.ejs");
})



//SHOW ROUTE

router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}= req.params;
    let listing= await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Listing you requested for does not exists!");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{listing});
}));



//CREATE ROUTE

router.post("/",validateListing,wrapAsync((req,res,next)=>{
    let{title,description,image,price,location,country}= req.body;
    let newListing= new Listing({
        title:title,
        description:description,
        image:image,
        price:price,
        location:location,
        country:country,
    });
    newListing.save().then(()=>{
        console.log("Listing saved successfully")
    })
    req.flash("success","New listing created!");
    res.redirect("/listings");
}));


//EDIT ROUTE

router.post("/:id/edit",wrapAsync(async(req,res)=>{
    let{id}= req.params;
    let listing= await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exists!");
        res.redirect("/listings");
    }
    res.render("./listings/edit.ejs",{listing});
}));


//UPDATE ROUTE

router.put("/:id",validateListing,wrapAsync(async (req,res)=>{
   
    // if(!req.body.listing){
    //     throw new ExpressError(400,"Send valid data for listing");
    // }
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated!");
    res.redirect("/listings");
}));


//DELETE ROUTE

router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id}= req.params;
    let deletedlist=  await Listing.findByIdAndDelete(id);
    console.log(deletedlist);
    req.flash("success"," listing Deleted!");
    res.redirect("/listings");
}));


module.exports= router;