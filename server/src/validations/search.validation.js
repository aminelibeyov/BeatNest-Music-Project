// Enhanced validation schemas for advanced search functionality

const Joi = require('joi');

// Advanced search schema with all possible filters
const advancedSearchSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sort: Joi.string().default('-createdAt'),
  search: Joi.string().trim().max(200),
  category: Joi.string(),
  genre: Joi.string().trim(),
  artist: Joi.string().trim(),
  status: Joi.string().valid('draft', 'pending', 'published', 'approved', 'rejected', 'archived').default('published'),
  minPlays: Joi.number().integer().min(0),
  maxPlays: Joi.number().integer().min(0),
  minLikes: Joi.number().integer().min(0),
  maxLikes: Joi.number().integer().min(0),
  dateFrom: Joi.date().iso(),
  dateTo: Joi.date().iso(),
  // Custom filters for future extension
  isExplicit: Joi.boolean(),
  language: Joi.string().trim()
});

// Schema for filter validation
const filterSchema = Joi.object({
  genres: Joi.array().items(Joi.string()),
  artists: Joi.array().items(Joi.string()),
  categories: Joi.array().items(Joi.string()),
  status: Joi.string().valid('draft', 'pending', 'published', 'approved', 'rejected', 'archived'),
  dateRange: Joi.object({
    from: Joi.date().iso(),
    to: Joi.date().iso()
  }),
  playRange: Joi.object({
    min: Joi.number().integer().min(0),
    max: Joi.number().integer().min(0)
  }),
  likeRange: Joi.object({
    min: Joi.number().integer().min(0),
    max: Joi.number().integer().min(0)
  })
});

// Schema for faceted search results
const facetedSearchSchema = Joi.object({
  search: Joi.string().required().trim().max(200),
  limit: Joi.number().integer().min(1).max(10).default(10)
});

// Bulk operations schema
const bulkUpdateSchema = Joi.object({
  ids: Joi.array().items(Joi.string()).required(),
  updates: Joi.object({
    status: Joi.string().valid('draft', 'pending', 'published', 'approved', 'rejected', 'archived'),
    category: Joi.string(),
    genre: Joi.string(),
    // Add other fields that can be bulk updated
  }).required()
});

module.exports = {
  advancedSearchSchema,
  filterSchema,
  facetedSearchSchema,
  bulkUpdateSchema
};
