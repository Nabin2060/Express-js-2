// /*
// create
// list
// read one order
// delete the order
// change the status of order
// */


const router = require("express").Router();

// day21
// const {mw} = require('../utils/secure')

// const mw=(req,res,next)=>{
//     console.log(req.headers)
//     const {username,password}=req.headers;
//     if(username === "nabin" && password === "password"){
//         next();
//     }
//     res.status(404).json({msg:"user unauthorized"})
// };
// router.get("/",mw(["admin"]),(req,res,next)=>{
//     try{
// res.json({msg:"list all orders",data:req.body})
//     }catch(e){
//         next(e);
//     }
// })



// router.post("/",mw(["user","admin"]), (req, res, next) => {
//     try {
//         res.json({ msg: "created new movie" });
//     } catch (e) {
//         next(e);
//     }
// });

// ++++++++++++++++

router.post("/",(req,res,next)=>{
  try{
     res.json({msg:"Created new movie"});
  }catch(e){
    next(e);
  }

});

router.get("/", (req, res, next) => {
    try {
        res.json({ msg: "list all movie",data:req.body });
    } catch (e) {
        next(e);
    }
});

router.get("/:id", (req, res, next) => {
    try {
        const { id } = req.params;
        res.json({ msg: `get one order by ${id}` });
    } catch (e) {
        next(e);
    }
})
router.delete("/:id", (req, res, next) => {
    try {
        const { id } = req.params;
        res.json({ msg: `delete order by ${id}` });
    } catch (e) {
        next(e);
    }
})

router.patch("/:id/status", (req, res, next) => {
    try {
        const { id } = req.params;
        res.json({ msg: `change order of one order by ${id}` });
    } catch (e) {
        next(e);
    }
})

router.put("/:id", (req, res, next) => {
    try {
        const { id } = req.params;
        res.json({ msg: `update one order by ${id}` });
    } catch (e) {
        next(e);
    }
})



module.exports = router;