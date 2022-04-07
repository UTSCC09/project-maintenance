/*jshint esversion: 9 */

const xss = require("xss");
const validator = require('validator');

function stripXss(inputStirng){
    return xss(inputStirng);
}

function unmodifiableValidate(inputString){
    return validator.isAlphanumeric(inputString);
}
function passwordValidate(password){
    return !validator.contains(password, ' ') 
        && validator.isStrongPassword(password, 
            {minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, returnScore: false})
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