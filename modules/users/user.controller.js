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
eventEmitter.addListener("emailVerification", (email) =>
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
    roles: user?.roles,
  };
  const token = generateToken(tokenPayload);
  if (!token) throw new Error("Something went wrong");
  return token;
};

const getById = () => {
  return userModel.findOne({ _id: id });
};

const list = () => {
  return userModel.find();
};

const updateById = (id, payload) => {
  return userModel.updateOne({ _id: id }, payload);
};

const removeById = (id) => {
  return userModel.deleteOne({ _id: id });
};
const generateEmailToken = async (payload) => {
  const { email } = payload;
  const user = await userModel.findOne({ email, isActive: true });
  if (!user) throw new Error({ msg: "User not found" });
  const isVerified = user?.isEmailVarified;
  if (!isVerified) {
    const token = generateOtp();
    const updateUser = await userModel.updateOne({ _id: user?._id }, { token });
    if (!updateUser) throw new Error("Something went wrong");

    eventEmitter.emit("emailVarification", email, token);
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

module.exports = {
  login,
  create,
  getById,
  list,
  updateById,
  removeById,
  generateEmailToken,
  verifyEmailToken,
};
