require("dotenv").config();
const express=require("express");
// const router= express.Router();
const mongoose = require('mongoose');

const morgan = require('morgan')

const indexRouter=require("./routes")


mongoose
.connect(process.env.DB_URL)
.then(()=>{
    console.log("Database connected succsessfully..");
})
.catch((e)=>{
    console.log("Database Error",e);
});


const app=express();
const PORT=Number(process.env.PORT);

app.use(express.json());

//application level middleware
// app.use((req,res,next)=>{

//     req.body.currency="NPR";
//     req.body.currentTime=new Date().toISOString();
//     next();
// });

// app.use(morgan('tiny')); //this are the different methods
//"combined"
app.use(morgan("div"));
app.use("/assets",express.static("public"));

app.use("/",indexRouter);



//error handling
// app.use((err,req,res,next)=>{
//     const errorMsg = err ? err.tostring() : "something went wrong";
//     res.status(500).json({ms: errorMsg});

// })

app.listen(PORT,()=>{
    console.log(`application running...${PORT}`);
})



