

const multer = require('multer')
const router = require("express").Router();

// const { generateToken } = require("../../utils/token");  to shif a controller
const { secure } = require("../../utils/secure");

// const { sendMail } = require("../../services/mailer");
// const e = require("express");

const userController = require("./user.controller");

const { validator } = require("./user.validator");
// const { date } = require("joi");


const stroage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/upload");
    },
    filename: function (req, file, cb) {
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
const upload = multer({ storage: stroage });

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
    async (req, res, next) => {
        try {
            // const {email}=req.body;
            if (req.file) {
                req.body.profie = req.file.path;
            }

            const result = await userController.create(req.body);
            // eventEmitter.emit("signup",email);
            // console.log(req.body,req.file,req.files);
            //call the nodemiler
            res.json({ msg: "User Register Successfully", data: result });
        } catch (e) {
            next(e);
        }
    }
)

router.post("/login", async (req, res, next) => {
    try {

        const result = await userController.login(req.body);
        res.json({ msg: "User successfully logged in", data: result });
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

router.post("/generate-email-token", async (req, res, next) => {
    try {
        const result = await userController.generateEmailToken(req.body);
        res.json({ msg: "Email Successfully sent", data: result });
    } catch (e) {
        next(e);
    }
});

router.post("/verify-email", async (req, res, next) => {
    try {
        const result = await userController.verifyEmailToken(req.body);
        res.json({ msg: "Email Successfully verified", data: result });
    } catch (e) {
        next(e);
    }
});

//Day-2

router.get("/", secure(["admin"]), async (req, res, next) => {
    try {

        //Todo Advanced ops
        const {page,limit,name}=req.query;
        const search={name};
        const data = await userController.list({page,limit,search});
        res.json({ msg: "user list generated", data });
    } catch (e) {
        next(e);
    }
});

//for user block ko lagi
router.patch("/:id/block", secure(["admin"]), async (req, res, next) => {
    try {
        const result = await userController.blockUser(req.params.id);
        res.json({ msg: "User status updated seccessfully", data: result });

    } catch (e) {
        next(e);
    }
});

//for a 
router.delete("/:id", secure(["admin"]), async (req, res, next) => {
    try {
        const result = await userController.removeById(req.params.id);
        res.json({ msg: "User Deleted successfully", data: result });
    } catch (e) {
        next(e);
    }
})

//for a 

router.get("/profile", secure(), async (req, res, next) => {
    try {
        const result = await userController.getProfile(req.currentUser);
        req.json({ msg: "User Profile successfully generated", data: result });
    } catch (e) {
        next(e);
    }
})
// Day 3

router.put("/profile", secure(), async (req, res, next) => {
    try {
      const result = await userController.updateById(req.currentUser, req.body);
      res.json({ msg: "User Profile Updated successfully", data: result });
    } catch (e) {
      next(e);
    }
  });
  
  router.get("/:id", secure(["admin"]), async (req, res, next) => {
    try {
      const result = await userController.getById(req.params.id);
      res.json({ msg: "User detail generated", data: result });
    } catch (e) {
      next(e);
    }
  });
  
  router.post(
    "/change-password",
    secure(["user", "admin"]),
    async (req, res, next) => {
      try {
        const result = await userController.changePassword(
          req.currentUser,
          req.body
        );
        res.json({ msg: "Password changed successfully", data: result });
      } catch (e) {
        next(e);
      }
    }
  );
  
  router.post("/reset-password", secure(["admin"]), async (req, res, next) => {
    try {
      const { id, newPassword } = req.body;
      if (!id || !newPassword) throw new Error("Something is missing");
      const result = await userController.resetPassword(id, newPassword);
      res.json({ msg: "Password Reset Successfully", data: result });
    } catch (e) {
      next(e);
    }
  });
  
  router.post("/forget-password-token", async (req, res, next) => {
    try {
      const result = await userController.forgetPasswordTokenGen(req.body);
      res.json({ msg: "FP Token sent successfully", data: result });
    } catch (e) {
      next(e);
    }
  });
  
  router.post("/forget-password", async (req, res, next) => {
    try {
      const result = await userController.forgetPasswordPassChange(req.body);
      res.json({ msg: "Password changed successfully", data: result });
    } catch (e) {
      next(e);
    }
  });

module.exports = router;
