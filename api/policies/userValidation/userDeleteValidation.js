var form = require('express-form'),
  field = form.field,
  validate = form.validate;

module.exports = form(
  field('email'),
  validate('email')
    .required("", "LOGIN_EMAIL_REQUIRED")
    .isEmail("LOGIN_INVALID_EMAIL")
);
