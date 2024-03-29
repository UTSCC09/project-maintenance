/*jshint esversion: 9 */
/**
 * 
 * References in general:
 * Validator npm: https://www.npmjs.com/package/validator
 * XSS npm: https://www.npmjs.com/package/xss
 * 
 */

const xss = require("xss");
const validator = require('validator');

function stripXss(inputStirng){
    return xss(inputStirng);
}

function unmodifiableValidate(inputString){
    return validator.isAlphanumeric(inputString);
}
function passwordValidate(password){
    return !validator.contains(password, ' ') && validator.isStrongPassword(password);
}

function phoneValidate(phone){
    return validator.isMobilePhone(phone);
}
function textFieldLenCheck(content, length){
    return content.length <= length;
}

function emailValidate(email){
    return validator.isEmail(email);
}

module.exports = {
    passwordValidate,
    stripXss,
    textFieldLenCheck,
    unmodifiableValidate,
    emailValidate,
    phoneValidate,
};