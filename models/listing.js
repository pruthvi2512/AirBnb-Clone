const mongoose=require("mongoose");
const Review = require("./review");
const schema=mongoose.Schema;
 const listingschema=new schema({
    title:{
        type:String,
        required: true,
    },
    description:{
        type:String,
    },
    image:{
        type:String,
        default:'https://media.istockphoto.com/id/1413052531/photo/autumn-maple-tree-leaves-arrangement-leaving-copy-space-on-green-background.jpg?s=1024x1024&w=is&k=20&c=prl5tNyMbAo5Z0dJE_h7BfmTIXT5Omyl6GCmsUvVllg=',
        set:(v)=> v ===""?"https://media.istockphoto.com/id/1413052531/photo/autumn-maple-tree-leaves-arrangement-leaving-copy-space-on-green-background.jpg?s=1024x1024&w=is&k=20&c=prl5tNyMbAo5Z0dJE_h7BfmTIXT5Omyl6GCmsUvVllg=":v,    
    },
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
    review:[
        {
            type:schema.Types.ObjectId,
            ref:Review
        }
    ]

 });
 const Listing=mongoose.model("Listing",listingschema);
 
module.exports = Listing;
