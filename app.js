const express=require("express");
const app=express();
const mongoose=require("mongoose");
const methodoverride=require("method-override");
const ejsmate=require("ejs-mate");
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
app.get("/listing",async(req,res)=>{
  const alllisting=await Listing.find();
  res.render("index.ejs",{alllisting});
});

//new route
app.get("/listing/new",(req,res)=>{
  res.render("listings/new.ejs");
});

//showbyid route
app.get("/listing/:id",async(req,res)=>{
let {id}=req.params;
const inddata=await Listing.findById(id);
res.render("listings/show.ejs",{inddata});
});

//create route

app.post("/listings", async (req, res)=>{
//  let {title,description,img,price,location,country}=req.body;
const newlisting = new Listing(req.body);
 await newlisting.save();
 res.redirect("/listing");
});

//edit route
app.get("/listing/:id/edit",async(req,res)=>{
  let {id}=req.params;
  const inddata=await Listing.findById(id);
res.render("listings/edit.ejs",{inddata});
  
});

app.put("/listing/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body});
    res.redirect(`/listing/${id}`);
});
app.delete("/listing/:id",async(req,res)=>{
  let {id}=req.params;
  await Listing.findByIdAndDelete(id)
  res.redirect(`/listing`);
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
app.listen(8080,()=>{
    console.log("connected");
});