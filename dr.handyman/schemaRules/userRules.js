/*jshint esversion: 9 */
/**
 * 
 * Reference In General:
 * Graphql Shield: https://www.graphql-shield.com/docs
 * 
 */
const { rule } = require('graphql-shield');
const { stripXss, textFieldLenCheck, unmodifiableValidate, phoneValidate, emailValidate } = require('./sanitizationRules');

/**
 * Comment on object:
 * @param signUpRule 1. Validate email, any xss embedded or invalid email format is met with error
 *                   2. Validate username, who should be non empty, less than 20 characters, and only alphranumerical
 *                   3. Validate password, who should be minimum 8 characters with no spaces, lower case, upper case, a number, and a symbol
 *                   4. Validate phone
 *                   5. User email must not already exist
 * @param setUserRule Validates phone number and new username
 */
const userRules = {
    signUpRule: rule()( async (_, { username, email, password, phone}) => {
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

    setUserRUle: rule()( async (_, { username, phone }) => {
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