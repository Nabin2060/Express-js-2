const { required } = require("joi");
const{Schema, model} =require("mongoose");

const userSchema = new Schema({
    name:{type:String,required:true},
    email:{
        type:String,required:true,unique:true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

    },
    password:{
        type:String,required:true,
    },
    roles:{
        type:Array,
        default:["user"],
        required:true,
    },

image:{
    type:String},
    token:{type:String},
    isEmailVarified:{type:Boolean,required:true,default:false},
    isActive:{
        type:Boolean,required:true,default:true},
    },
    {timestamps:true}

);

module.exports=model("user",userSchema);

