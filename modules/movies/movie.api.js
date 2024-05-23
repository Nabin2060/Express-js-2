/* 
create
read only one movie
update
delete
list
update the sets for one movie
change the relese date

*/

// ++++ ss 


const router = require("express").Router();
const movieController = require("./movie.controller");
const { secure } = require("../../utils/secure");
const multer=require("multer");
const stroage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, "public/upload/movies");
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

router.get("/", async(req, res, next) => {
  try {
    const result=await movieController.list();
    res.json({ msg: "All movies list",data:result });
  } catch (e) {
    next(e);
  }
});

router.post(
  "/",
   secure(["admin"]),
   upload.single("poster"),
   async (req, res, next) => {
  try {
    if(req.file){
      req.body.poster=req.file.path;
    }
    const result = await movieController.create(req.body);
    res.json({ msg: "Created new movie", data: result });
  } catch (e) {
    next(e);
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const { slug } = req.params;
    const result = await movieController.getByS(slug);
    res.json({ msg: `Read one movie by ${slug}`, data: result });
  } catch (e) {
    next(e);
  }
})
router.put("/:slug", secure(["admin"]), async (req, res, next) => {
  try {
    const { slug } = req.params;
    const result = await movieController.update(slug, req.body);
    res.json({ msg: `Update one movie by ${slug}`, data: result });
  } catch (e) {
    next(e);
  }
});

router.delete("/:id", secure(["admin"]), async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await movieController.remove(id);
    res.json({ msg: `Delete one movie by ${id}`, data: result });
  } catch (e) {
    next(e);
  }
});

router.patch("/:id/seats", secure(["admin"]), async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await movieController.updateSeats(id, req.body);
    res.json({
      msg: `Update the seat number of one movie by ${id}`,
      data: result,
    });
  } catch (e) {
    next(e);
  }
});

router.patch("/:id/release-date", secure(["admin"]), async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await movieController.updateReleaseDate(id, req.body);
    res.json({
      msg: `Update the release date of one movie by ${id}`,
      data: result,
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;


// +++

// const router=require("express").Router();
// const { secure } = require("../../utils/secure");

// const movieController=require("./movie.controller");

// router.get("/",secure(["admin"]),async(req,res,next)=>{
//     try{
        
// const data=await movieController.list();
// res.json({msg:"movie list generated",data:[]});

//     }catch(e){
//         next(e);
//     }
// });

// router.post("/",secure(["admin"]),
// async(req,res,next)=>{
//     try{
//         const result=await movieController.create();
//         res.json({msg:"Created new movie",data:result});
//     }catch(e){
//         next(e);
//     }
// });

// router.get("/:id",(req,res,next)=>{
//     try{
//         const {id}=req.params;
//         res.json({msg:`Read one movie by ${id}`});
//     }catch(e){
//         next(e);
//     }
// });
// router.put("/:id",(req,res,next)=>{
//     try{
//         const {id}=req.params;
//         res.json({msg:`Update one movie by ${id}`});
//     }catch(e){
//         next(e);
//     }
// });

// router.delete("/:id",(req,res,next)=>{
//     try{
//         const {id}=req.params;
//         res.json({msg:`Delete one movie by ${id}`});
//     }catch(e){
//         next(e);
//     }
// });

// router.patch("/:id/seats",(req,res,next)=>{
//     try{
//         const {id}=req.params;
//         res.json({msg:`Update the seat of one movie by ${id}`});
//     }catch(e){
//         next(e);
//     }
// });

// router.patch("/:id/release-date",(req,res,next)=>{
//     try{
//         const {id}=req.params;
//         res.json({msg:`Update the release-date of one movie by ${id}`});
//     }catch(e){
//         next(e);
//     }
// });

// module.exports=router;