const Joi = require('joi');

module.exports = {
    validateBody: (schema) => {
      return (req, res, next) => {
        const result = Joi.validate(req.body, schema);
        if (result.error) {
          return res.status(400).json(result.error);
        }
  
        if (!req.value) { req.value = {}; }
        req.value['body'] = result.value;
        next();
      }
    },
  
    schemas: {
      signSchema: Joi.object().keys({
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        gender: Joi.string(),
        phone: Joi.number(),
        email: Joi.string().email({ minDomainAtoms: 2 }).required(),
        password: Joi.string().required(),
        
      }),
      loginSchema: Joi.object().keys({
        email: Joi.string().email({ minDomainAtoms: 2 }).required(),
        password: Joi.string().required(),
      })
    }
  }