const express=require("express");
const app=express();
const mongoose=require("mongoose");
const methodoverride=require("method-override");
const ejsmate=require("ejs-mate");
const {listingschema}=require("./schema.js");
const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/expresserror.js");
const Review=require("./models/review.js");
// var bodyParser=require("body-parser");

app.use(express.urlencoded({extended: true}));
app.use(methodoverride("_method"));
app.engine("ejs",ejsmate);

// var urlencodedParser = bodyParser.urlencoded({ extended: false });

const Listing=require("./models/listing.js");
const path=require("path");   
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"/public")));

main().then(()=>{
    console.log("db connected");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}


app.get("/", (req,res)=>{
  res.send("working");
});

//showall route
app.get("/listing", wrapAsync(async(req,res)=>{
  const alllisting=await Listing.find();
  res.render("index.ejs",{alllisting});
}));

//new route
app.get("/listing/new",(req,res)=>{
  res.render("listings/new.ejs");
});

//showbyid route
app.get("/listing/:id",wrapAsync(async(req,res)=>{
let {id}=req.params;
const inddata=await Listing.findById(id);
res.render("listings/show.ejs",{inddata});
}));

//create route

app.post("/listings", wrapAsync (async (req, res,next)=>{
//  let {title,description,img,price,location,country}=req.body;
let result=listingschema.validate(req.body);
console.log(result);
 const newlisting = new Listing(req.body);
 await newlisting.save();
 res.redirect("/listing");
}));

//edit route
app.get("/listing/:id/edit",wrapAsync(async(req,res)=>{
  let {id}=req.params;
  const inddata=await Listing.findById(id);
res.render("listings/edit.ejs",{inddata});
  
}));

app.put("/listing/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body});
    res.redirect(`/listing/${id}`);
}));
app.delete("/listing/:id",wrapAsync(async(req,res)=>{
  let {id}=req.params;
  await Listing.findByIdAndDelete(id)
  res.redirect(`/listing`);
}));


//review
app.post("/listings/:id/review",async(req,res)=>{
  let listing=await Listing.findById(req.params.id);
  let newreview=new Review(req.body.review);
  console.log(newreview);
  listing.review.push(newreview);
  newreview.save();
  listing.save();

   res.send("reviewww....");
});





// app.get("/testlisting",async(req,res)=>{
//     const samplelist=new Listing({
//         title:'My home',
//         description:'this is my house',
//         price:1200,
//         location:'pune',
//         country:'india',
//     });s
//     await samplelist.save();
//     console.log("samle saved");
//     res.send("succesfull");

// });
app.all("*",(req,res,next)=>{
next(new ExpressError(404,"page not found!!!!"));
});
app.use((err,req,res,next)=>{
  let{statusCode=500,message='somethis went wrong'}=err;
  res.render("error.ejs",{message});
  // res.status(statusCode).send(message);
});
app.listen(8080,()=>{
    console.log("connected");
});