const mongoose=require("mongoose");
const schema=mongoose.Schema;

const reviewschema=new schema({
    comment:String,
    rating:{
        type:Number,
        max: 1,
        max: 5
    },
    createdat:{
        type:Date,
        default:Date.now()
    }

});


const Review =mongoose.model("Review",reviewschema);
module.exports=Review;