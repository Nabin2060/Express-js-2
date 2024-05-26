const { required, number } = require("joi");
const {schema,model, Schema}=require("mongoose");
const {objectId,UUID}=Schema.Types;

const orderSchema=new Schema(
    {
        id:{},
        buyer:{type:objectId,ref:"User",required:true},
        total:{type:number,required:true},
        products:[
            {
                quality:{type:Number,required:true,default:1},
                price{},}
            
            type:String,


        ]
    },
    {timestamps:true},

);
module.exports=model("Order",orderSchema);