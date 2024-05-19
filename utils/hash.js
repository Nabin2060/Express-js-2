
const Bcrypt = require("bcryptjs");

const genHash = (payload) => {
    return Bcrypt.hashSync(payload);
};

const compareHash = (hashPayload, payload) => {
  return Bcrypt.compareSync(payload,hashPayload)
};

module.exports = { genHash, compareHash };