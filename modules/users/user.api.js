

const multer  = require('multer')
const router = require("express").Router();

// const { generateToken } = require("../../utils/token");  to shif a controller
const { secure } = require("../../utils/secure");

// const { sendMail } = require("../../services/mailer");
// const e = require("express");

const userController =require("./user.controller");

const { validator } = require("./user.validator");
// const { date } = require("joi");


const stroage=multer.diskStorage({
  destination: function(req,file,cb){
        cb(null,"public/upload");

        

    },
    filename:function(req,file,cb){
        cb(
          null,
          file.fieldname.concat(
            "-",
            Date.now(),
            ".",
            file.originalname.split(".")[1],

        )
     );

    },

});
const upload= multer({storage:stroage});

const uploads = multer({
    storage: multer.memoryStorage(),
    limits: {
      fieldNameSize: 255,
      fileSize: 500000,
      files: 1,
      
    }
  });





// const eventEmitter =new event.EventEmitter();
// eventEmitter.addListener("signup",(email)=>
//     sendMail({
//         email,
//         subject:"MovieMate Signup",
//         htmlMsg:"<b>Thank you for joinning MovieMate</b>",
//     })
// );

router.get("/", secure(["admin"]), (req, res, next) => {
    try {
        res.json({ msg: "User List generated", data: [] });
    } catch (e) {
        next(e);
    }
});

// router.post("/register", validator,  (req, res, next) => {
//     try {
//         const { email } = req.body;
//         if (!email) throw new Error("Email is missing");
//         //call the nodemalier
//         eventEmitter.addListener("signup",(email)=>
//             sendMail({
//                 email,
//                 subject: "MovieMate signup",
//                 htmlMsg: "<b>Thank you for joining MovieMate</b>",
//             })
//         );
//        eventEmitter.emit("signup",email);
//         res.json({msg:"User Registerd Successfully"});
    
//     } catch (e) {
//         next(e);
//     }
// });

router.post("/register",
    upload.single("profile"),
    validator,
    async(req,res,next)=>{
        try{
            // const {email}=req.body;
            if(req.file){
                req.body.profie=req.file.path;
            }
        
            const result=await userController.create(req.body);
            // eventEmitter.emit("signup",email);
            // console.log(req.body,req.file,req.files);
            //call the nodemiler
            res.json({msg:"User Register Successfully",data:result});
        }catch(e){
            next(e);
        }
    }
)

router.post("/login", async(req, res, next) => {
    try {

        const result=await userController.login(req.body);
        res.json({msg:"User successfully logged in",data:result});
        // const { email, password } = req.body;
        // if (!email || !password) throw new Error("Email or password is missing");
        // if (email === "raktim@rumsan.com" && password === "123") {
        //     //generate the jwt token
        //     const payload = {
        //         email,
        //         roles: ["admin"],
        //     };
        //     const token = generateToken(payload);
        //     res.json({ msg: "User logged in successfully", data: token });
        // } else {
        //     res.json({ msg: "Email or Password Invalid", data: "" });
        // }
    } catch (e) {
        next(e);
    }
});

router.post("/generate-email-token",async(req,res,next)=>{
    try{
        const result= await userController.generateEmailToken(req.body);
        res.json({msg:"Email Successfully sent",data:result});
    }catch(e){
        next(e);
    }
});

router.post("/verify-email",async(req,res,next)=>{
    try{
        const result=await userController.verifyEmailToken(req.body);
        res.json({msg:"Email Successfully verified",data:result});
    }catch(e){
        next(e);
    }
});

module.exports = router;
