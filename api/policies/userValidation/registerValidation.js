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
  validate('firstName')
    .required("", "FIRST_NAME_REQUIRED"),
  validate('lastName')
    .required("", "LAST_NAME_REQUIRED"),
  validate('email')
    .required("", "LOGIN_EMAIL_REQUIRED")
    .isEmail("LOGIN_INVALID_EMAIL"),
  validate('password')
    .required("", "LOGIN_PASSWORD_REQUIRED")
    .minLength(8, "REGISTRATION_PASSWORD_MIN_LENGTH"),
  validate('age')
    .required("", "AGE_REQUIRED"),
  validate('occupation')
    .required("", "OCCUPATION_REQUIRED"),
  validate('dob')
    .required("", "DATE_OF_BIRTH_REQUIRED")
);
