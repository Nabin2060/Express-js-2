# Express-js-1
new express js repo

text
client le kun kun method bata data send garxa /pathuxa.
Post,put,patch P3 ma frontend bata data backend mah data aauxa
  ra yo aaune tarika lai
   req.query
   req.params
   req.body;

   get=>
   post=>
   put=>change one or more data
   patch=>change one one data data
   delete=>

vane backend bata frontend  mah get or delete 


//mongod --version


router.put("/:id", (req, res, next) => {
    try {
        const { id } = req.params;
        res.json({ msg: `user updated ${id}` });
    }
    catch (e) {
        // next();
    }
})

// router.get("/:id",(req,res,next)=>{
//     try{
//         const {id} =req.params;
//         res.json({msg:`one user selected ${id}`});
//     }
//     catch(e){
//         next();
//     }
// })

// router.patch("/:id/change-status",(req,res,next)=>{
//     try{
//         const {id}=req.params;
//         res.json({msg:`user changed-status  ${id}`});
//     }
//     catch(e){
//         next();
//     }
// })

// router.patch("/:id/profile",(req,res,next)=>{
//     try{
//         const {id}=req.params;
//         res.json({msg:`user profile updated ${id}`});
//     }
//     catch(e){
//         next();
//     }
// })

// router.get("/:id/password-reset",(req,res,next)=>{
//     try{
//         res.json({msg:"Your password reset"});
//     }
//     catch(e){
//         next();
//     }
// })
// router.get("/:id/password-verified",(req,res,next)=>{
//     try{
//         const {id}=req.params;
//         res.json({msg:"Your password verified"});
//     }
//     catch(e){
//         next();
//     }
// })

// router.get("/:id/token-verified",(req,res,next)=>{
//     try{
//         const {id}=req.params;
//         res.json({msg:`Your token verified ${id}`});
//     }
//     catch(e){
//         next();
//     }
// })

// router.post("/:id/change-password",(req,res,next)=>{
//     try{
//         const {id} =req.params;
//         res.json({msg:`password changed by ${id}`});
//     }
//     catch(e){
//         next();
//     }
// })


// router.post("/:id/password-forgotten",(req,res,next)=>{
//     try{
//         const {id} =req.params;
//         res.json({msg:`password forgotten by ${id}`});
//     }
//     catch(e){
//         next();
//     }
// })

// router.post("/:id/register",(req,res,next)=>{
//     try{
//         const {id} =req.params;
//         res.json({msg:`User Registerd by ${id}`});
//     }
//     catch(e){
//         next();
//     }
// })

// router.post("/:id/login",(req,res,next)=>{
//     try{
//         const {id}=req.params;
//         res.json({msg:`User login by ${id}`});
//     }
//     catch(e){
//         next();
//     }
// })



// router.get("/",(req,res,next)=>{
//     try{
//         res.json({msg:"User listed"});
//     }
//     catch(e){
//         next();
//     }
// })



// router.delete("/:id",(req,res,next)=>{
//     try{
//         const {id} =req.params;
//         res.json({msg:`User deleted by id ${id}`});
//     }
//     catch(e){
//         next();
//     }
// })

// module.exports=router;