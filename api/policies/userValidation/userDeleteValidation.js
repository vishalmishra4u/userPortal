var form = require('express-form'),
  field = form.field,
  validate = form.validate;

module.exports = form(
  field('email'),
  field('adminEmail'),
  validate('email')
    .required("", "EMAIL_REQUIRED")
    .isEmail("INVALID_EMAIL"),
  validate('adminEmail')
    .required("", "EMAIL_REQUIRED")
    .isEmail("INVALID_EMAIL")
);
