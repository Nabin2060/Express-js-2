const event = require("events");
const userModel = require("./user_model");
const { genHash, compareHash } = require("../../utils/hash");
const { generateToken, generateOtp } = require("../../utils/token");

const { sendMail } = require("../../services/mailer");
const { token } = require("morgan");

const eventEmitter = new event.EventEmitter();
eventEmitter.addListener("signup", (email) =>
  sendMail({
    email,
    subject: "MovieMate Signup",
    htmlMsg: "<b>Thank you for joinning MovieMate</b>",
  })
);

//for a email varification
eventEmitter.addListener("emailVerification", (email,token) =>
  sendMail({
    email,
    subject: "MovieMate Email Verification",
    htmlMsg: `<b>${token}</b> is your otp token`,
  })
);

const create = async (payload) => {
  const { email, password } = payload;
  payload.password = genHash(password);
  const result = await userModel.create(payload);

  //call the nodemailer
  eventEmitter.emit("signup", email);
  return result;
};


const login = async (payload) => {
  const { email, password } = payload;

  //check for email
  const user = await userModel.findOne({ email, isActive: true });
  if (!user) throw new Error("User Not Found..");

  const isVerified = user?.isEmailVarified;
  if (!isVerified) throw new Error({ msg: "Email Verification required.." });

  const isValidPw = compareHash(user?.password, password);
  if (!isValidPw) throw new Error("Email or password invalid");

  const tokenPayload = {
    name: user?.name,
    email:user?.email,
  };
  const token = generateToken(tokenPayload);
  if (!token) throw new Error("Something went wrong");
  return token;
};

// +++++++ ss

// const login = async (payload) => {
//   const { email, password } = payload;
//   // check for email
//   const user = await userModel
//     .findOne({ email, isActive: true })
//     .select("+password");
//   if (!user) throw new Error("User not found");
//   const isVerified = user?.isEmailVerified;
//   if (!isVerified) throw new Error("Email Verification required");
//   const isValidPw = compareHash(user?.password, password);
//   if (!isValidPw) throw new Error("Email or password invalid");
//   const tokenPayload = {
//     name: user?.name,
//     email: user?.email,
//   };
//   const token = generateOtp(tokenPayload);
//   if (!token) throw new Error("Something went wrong");
//   return token;
// };
// ++++++++++
const getById = (id) => {
  return userModel.findOne({ _id: id });
};

const list = async ({page=1,limit=10,search}) => {
  console.log(page,limit);
  const query=[];
  //search
  if(search?.name){
    query.push({
      $match:{
        
          '$match': {
            name: new RegExp('n', 'gi')
          }
        
      }
    })
  }
  
    //pagination
  query.push(
  
    {
      $facet: {
        metadata: [
          {
            $count: "total",
          },
        ],
        data: [
          {
            $skip: (+page - 1) * +limit,
          },
          {
            $limit: +limit,  //and go check list
          },
        ],
      },
    },
    {
      $addFields: {
        total: {
          $arrayElemAt: ["$metadata.total", 0],
        },
      },
    },
    {
      $project: {
        metadata: 0,
        "data.password": 0,
      },
    }
  );
  // return userModel.find();
  const result = await userModel.aggregate(query);
  return{
    total:result[0]?.total || 0,
    users:result[0]?.data,
    page:+page,
    limit:+limit,

  };
};

const updateById = (id, payload) => {

  return userModel.findOneAndUpdate({ _id: id }, payload, { new: true });

  // {
  //   '$match': {
  //     'name': new RegExp('n', 'gi')
  //   }
};

const removeById = (id) => {
  return userModel.deleteOne({ _id: id });
};

const generateEmailToken = async (payload) => {
  const { email } = payload;
  const user = await userModel.findOne({ email, isActive: true });
  if (!user) throw new Error("User not found");
  const isVerified = user?.isEmailVerified;
  if (!isVerified) {
    const token = generateOtp();
    const updatedUser = await userModel.updateOne({ _id: user?._id }, { token });
    if (!updatedUser) throw new Error("Something went wrong");
    console.log({ token });
    eventEmitter.emit("emailVerification", email, token);
  }
  return true;
};

const verifyEmailToken = async (payload) => {
  const { email, token } = payload;
  const user = await userModel.findOne({ email, isActive: true });
  if (!user) throw new Error({ msg: "User not found" });
  const isTokenValid = user?.token === token;
  if (!isTokenValid) throw new Error("Token missmatch");
  const result = await userModel.updateOne(
    { _id: user?._id },
    { isEmailVarified: true, token: "" }
  );
  if(!result)throw new Error("Something went wrong");
  return isTokenValid;
};

// +++++++++ss
// const verifyEmailToken = async (payload) => {
//   const { email, token } = payload;
//   const user = await userModel.findOne({ email, isActive: true });
//   if (!user) throw new Error("User not found");
//   const isTokenValid = user?.token === token;
//   if (!isTokenValid) throw new Error("Token mismatch");
//   const result = await userModel.updateOne(
//     { _id: user?._id },
//     { isEmailVerified: true, token: "" }
//   );
//   if (!result) throw new Error("Something went wrong");
//   return isTokenValid;
// };
// ++++

const blockUser = async (payload) => {
  const user = await userModel.findOne({ _id: payload });
  if (!user) throw new Error("user not found");
  const statusPayload = {
    isActive: !user?.isActive, //block ra unblock dubai garxa
  };
  const updatedUser = await userModel.updateOne(
    { _id: payload },
    statusPayload
  );
  if (!updatedUser) throw new Error("Something went Wrong");
  return true;
};

const getProfile = (_id) => {
  return userModel.findOne({ _id });
};

const changePassword = async (id, payload) => {
  const { oldPassword, newPassword } = payload;
  // Get old password the user
  const user = await userModel
    .findOne({
      _id: id,
      isActive: true,
      isEmailVerified: true,
    })
    .select("+password");
  if (!user) throw new Error("user not found");
  // compare that password to user database
  const isValidPw = compareHash(user?.password, oldPassword);
  if (!isValidPw) throw new Error("Password mismatch");
  // convert newPassword to hashPassword
  const data = {
    password: genHash(newPassword),
  };
  // store that hash password
  return userModel.updateOne({ _id: id }, data);
};

const resetPassword = async (id, newPassword) => {
  // user exist??
  const user = await userModel.findOne({ _id: id });
  if (!user) throw new Error("User not Found");
  // newPassword hash
  const hashPw = genHash(newPassword);
  // user update
  return userModel.updateOne({ _id: id }, { password: hashPw });
};

const forgetPasswordTokenGen = async (payload) => {
  const { email } = payload;
  // Find the user
  const user = await userModel.findOne({
    email,
    isActive: true,
    isEmailVerified: true,
  });
  if (!user) throw new Error("User not found");
  // Generate the token
  const otp = generateOtp();
  // Store the token in the db
  const updatedUser = await userModel.updateOne({ email }, { otp });
  if (!updatedUser) throw new Error("Something went wrong");
  // send the token in the email
  eventEmitter.emit("emailVerification", email, otp);
  return true;
};

const forgetPasswordPassChange = async (payload) => {
  const { email, otp, newPassword } = payload;
  // Find the user
  const user = await userModel.findOne({
    email,
    isActive: true,
    isEmailVerified: true,
  });
  if (!user) throw new Error("User not found");
  if (otp !== user?.otp) throw new Error("OTP mismatch");
  const hashPw = genHash(newPassword);
  const updatedUser = await userModel.updateOne(
    { email },
    { password: hashPw, otp: "" }
  );
  if (!updatedUser) throw new Error("Something went wrong");
  return true;
};

module.exports = {
  blockUser,
  changePassword,
  resetPassword,
  forgetPasswordPassChange,
  forgetPasswordTokenGen,
  login,
  create,
  getById,
  getProfile,
  list,
  updateById,
  removeById,
  generateEmailToken,
  verifyEmailToken,
};








// const login = async (payload) => {
//   const { email, password } = payload;

//   //check for email
//   const user = await userModel.findOne({ email, isActive: true });
//   if (!user) throw new Error("User Not Found..");

//   const isVerified = user?.isEmailVarified;
//   if (!isVerified) throw new Error({ msg: "Email Verification required.." });

//   const isValidPw = compareHash(user?.password, password);
//   if (!isValidPw) throw new Error("Email or password invalid");

//   const tokenPayload = {
//     name: user?.name,
//     email:user?.email,
//   };
//   const token = generateToken(tokenPayload);
//   if (!token) throw new Error("Something went wrong");
//   return token;
// };

// const getById = () => {
//   return userModel.findOne({ _id: id });
// };

// const list = () => {
//   return userModel.find();
// };

// const updateById = (id, payload) => {
//   return userModel.updateOne({ _id: id }, payload);
// };

// const removeById = (id) => {
//   return userModel.deleteOne({ _id: id });
// };
// const generateEmailToken = async (payload) => {
//   const { email } = payload;
//   const user = await userModel.findOne({ email, isActive: true });
//   if (!user) throw new Error({ msg: "User not found" });
//   const isVerified = user?.isEmailVarified;
//   if (!isVerified) {
//     const token = generateOtp();
//     const updateUser = await userModel.updateOne({ _id: user?._id }, { token });
//     if (!updateUser) throw new Error("Something went wrong");

//     eventEmitter.emit("emailVarification", email, token);
//   }
//   return true;
// };

// const verifyEmailToken = async (payload) => {
//   const { email, token } = payload;
//   const user = await userModel.findOne({ email, isActive: true });
//   if (!user) throw new Error({ msg: "User not found" });
//   const isTokenValid = user?.token === token;
//   if (!isTokenValid) throw new Error("Token missmatch");
//   const result = await userModel.updateOne(
//     { _id: user?._id },
//     { isEmailVarified: true, token: "" }
//   );
//   if(!result)throw new Error("Something went wrong");
//   return isTokenValid;
// };

// ///
// const blockUser = async (payload)=>{
//   const {id} =payload;
//   const user = await userModel.findOne({_id:payload});
// if(!user)throw new Error("User not found");

// // const getProfile=(_id)=>{
// //   return userModel.findOne({_id});
// // };

// // const statusPayload={
// //   isActive:!user?.isActive,
// // };
// const updateUser=await userModel.updateOne({_id:payload},statusPayload);
// if(!updateUser)throw new Error("Something went wrong");
// return true;
// }

// module.exports = {
//   blockUser,
//   login,
//   create,
//   getById,
//   // getProfile,
//   list,
//   updateById,
//   removeById,
//   generateEmailToken,
//   verifyEmailToken,
// };
