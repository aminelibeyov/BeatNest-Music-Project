const Joi = require('joi');

const createSongSchema = Joi.object({
  title: Joi.string().required().min(2).max(100),
  artist: Joi.string().required().min(2).max(100),
  category: Joi.string().required(),
  duration: Joi.number().required().positive(),
  description: Joi.string().max(500),
  lyrics: Joi.string().max(5000),
  genre: Joi.string().required()
});

const updateSongSchema = Joi.object({
  title: Joi.string().min(2).max(100),
  artist: Joi.string().min(2).max(100),
  category: Joi.string(),
  duration: Joi.number().positive(),
  description: Joi.string().max(500),
  lyrics: Joi.string().max(5000),
  genre: Joi.string()
}).min(1);

const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sort: Joi.string().default('-createdAt'),
  search: Joi.string(),
  filter: Joi.object()
});

module.exports = {
  createSongSchema,
  updateSongSchema,
  paginationSchema
};
