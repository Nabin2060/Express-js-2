
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

// +++++++++++++++++++++++++++++++++
//List API
//List Controller
//feature :pagination,sort,search,filter

const d =[{id:1},{id:2},{id:3},{id:4}];

//Pagination
limit=2;
page=1;


const strtIndex=(page-1)*limit;
const endIndex=strtIndex+limit;
const result=d.slice(strtIndex,endIndex);
console.log(result);

//Sort
const ageSorter=(a,b)=>a-b;
d.sort(ageSorter);

//search
const id=1;
const searchResult=d.find((data)=>data.id===id);
console.log(searchResult);

