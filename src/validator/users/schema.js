const Joi = require('joi');

const UserPayloadSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    fullname: Joi.string().required(),
});

module.exports = { UserPayloadSchema };
//referensi dari https://www.dicoding.com/academies/271/tutorials/17584?from=17583