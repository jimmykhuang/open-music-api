const Joi = require('joi');

const SongPayloadSchema = Joi.object({
    title: Joi.string().required(),
    year: Joi.number().integer().min(1900).max(2021)
        .required(),
    performer: Joi.string().required(),
    genre: Joi.string().required(),
    duration: Joi.number().required(),

});

module.exports = { SongPayloadSchema };

//referensi dari https://www.dicoding.com/academies/271/tutorials/14462