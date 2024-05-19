/* 
create
read only one movie
update
delete
list
update the sets for one movie
change the relese date

*/

const router=require("express").Router();

router.get("/",(req,res,next)=>{
    try{
        res.json({msg:"all movies list"});
    }catch(e){
        next(e);
    }
});

router.post("/",(req,res,next)=>{
    try{
        res.json({msg:"Created new movie"});
    }catch(e){
        next(e);
    }
});

router.get("/:id",(req,res,next)=>{
    try{
        const {id}=req.params;
        res.json({msg:`Read one movie by ${id}`});
    }catch(e){
        next(e);
    }
});
router.put("/:id",(req,res,next)=>{
    try{
        const {id}=req.params;
        res.json({msg:`Update one movie by ${id}`});
    }catch(e){
        next(e);
    }
});

router.delete("/:id",(req,res,next)=>{
    try{
        const {id}=req.params;
        res.json({msg:`Delete one movie by ${id}`});
    }catch(e){
        next(e);
    }
});

router.patch("/:id/seats",(req,res,next)=>{
    try{
        const {id}=req.params;
        res.json({msg:`Update the seat of one movie by ${id}`});
    }catch(e){
        next(e);
    }
});

router.patch("/:id/release-date",(req,res,next)=>{
    try{
        const {id}=req.params;
        res.json({msg:`Update the release-date of one movie by ${id}`});
    }catch(e){
        next(e);
    }
});

module.exports=router;