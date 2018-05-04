var form = require('express-form'),
  field = form.field,
  validate = form.validate;

module.exports = form(
  field('firstName'),
  field('lastName'),
  field('email'),
  field('password'),
  field('age'),
  field('occupation'),
  field('dob'),
  validate('email')
    .required("", "LOGIN_EMAIL_REQUIRED")
    .isEmail("LOGIN_INVALID_EMAIL")
);
