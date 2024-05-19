
const Joi = require("joi");

//schema define 
const userSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com"] },
  })
    .required(),
  
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30),
        // .required(),

        //for a password
        password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),

       //for a birth year 
        birth_year: Joi.number()
        .integer()
        .min(1800)
        .max(2024),

        gender: Joi.string().valid("m", "f", "o"),
        profile:Joi.string(),
});
const validator = async (req, res, next) => {
  try {
    const { error } = await userSchema.validateAsync(req.body);
    next();
    // if (error) next(error);
  } catch (e) {
    next(e);
  }
};

module.exports = { validator };