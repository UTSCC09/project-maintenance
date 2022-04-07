/*jshint esversion: 9 */
const { rule } = require('graphql-shield');
const { stripXss, textFieldLenCheck, unmodifiableValidate, phoneValidate } = require('./sanitizationRules');

const userRules = {
    signUpRule: rule()( async (parent, { username, email, password, phone}, context) => {
        if (!emailValidate(email) || stripXss(email) != email)
            return new Error("Invalid Email");
        if (username.length <= 0 || !textFieldLenCheck(username, 20) || !unmodifiableValidate(username) || stripXss(username) != username)
            return new Error("Username should contain alphanumerics and be less than or equal to 20 letters");
        if (!passwordValidate(password))
            return new Error("Password should be minimum 8 characters with no spaces, lower case, upper case, a number, and a symbol");
        if (!phoneValidate(phone))
            return new Error("Phone number invalid");

        const existUser = await User.findOne({ email: email});
        if (existUser)
            return new Error('User with email already exists');
        return true;
    }),

    setUserRUle: rule()( async (parent, { username, phone }, context) => {
        if (!phoneValidate(phone))
            throw new Error("Phone number invalid");
        if (username.length <= 0 || !textFieldLenCheck(username, 20) || !unmodifiableValidate(username) || stripXss(username) != username)
            throw new Error("Username should contain alphanumerics and be less than or equal to 20 letters");

        return true;
    }),
}

module.exports = {
    userRules,
};