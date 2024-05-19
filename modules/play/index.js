
//promises

// const { promises } = require("nodemailer/lib/xoauth2");

// const sol = new promise ((resolve,reject)=>{
//     setTimeout(()=>{
//         resolve(4);
//     },5000);
// });

// sol.then((result)=>{
//     console.log("I am result",result);
// })

//promise resolve program

// const promise = new promises(function(resolve,reject){
//    setTimeout(function (){
//     const sum= 4+4;
//      resolve(sum);

//    },2000);
// });
// promise.then(function(result){
//     console.log(result);
// });

//reject 
// const promise = new promises(function(resolve,reject){
//     setTimeout(function (){
//      const sum= 4+4+"a";
//       if(isNaN(sum)){
//         reject("Error while calculating sum..");

//       }else{
//         resolve(sum);
//       }
 
//     },2000);
//  });
//  promise.then(function(result){
//      console.log(result);
//  });




// setTimeout(()=>{
//     console.log("2");
// },2000);

// setInterval(()=>{
//     console.log("Nabin");
// },2000);

// setImmediate(()=>{
// console.log("nabin ad")
// },3000);