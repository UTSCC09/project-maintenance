/*jshint esversion: 9 */

/**
 * 
 * Reference In General:
 * Graphql Shield: https://www.graphql-shield.com/docs
 * 
 */
const { rule } = require('graphql-shield');
const { Comment, Appointment, User } = require('../mongooseSchemas');
const { textFieldLenCheck } = require('./sanitizationRules');

/**
 * Comment on Object
 * 
 * @param addCommmentRule 1. Validates content who should have at least one character and maximum 500 letters
 *                        2. Validates appointmentId who should exist and has already passed
 *                        3. Validates worker email who should exist
 *                        4. Validates rating who should be between 0 and 5
 *                        5. Validates whether the appointment has already been commented
 * @param editCommmentRule Validates content and rating
 * @param isOwnCommenter Errors if current user does not own the comment
 */
const commentRules = {
    addCommmentRule: rule()( async (_, {appointmentId, workerEmail, rating, content}, context) => {
        if (content.length <= 0 || !textFieldLenCheck(content, 500))
            return new Error("Content should have at least one character and maximum 500 letters");

        const curDate = new Date();
        const appointment = await Appointment.findOne({$and: [
            {_id: appointmentId},
            { endTime: { $lte: curDate.getTime() }}
        ]});
        
        if (appointment == null)
            return new Error("No such appointment or appointment not finished");

        const worker = await User.findOne({$and: [
            {email: workerEmail},
            {type: "worker"}
        ]});
        if (worker == null || appointment.workerEmail != workerEmail || appointment.userEmail != context.getUser().email)
            return new Error("No such worker or wrong appointment");
        else if (worker.email == context.getUser().email)
            return new Error("Cannot comment yourself");

        const duplicate = await Comment.findOne({ $and : [
            {workerEmail},
            {appointmentId},
            {userEmail: context.getUser().email}
        ]});

        if (duplicate != null)
            return new Error("Duplicate comment");

        if (rating != null && (rating > 5 || rating < 0))
            return new Error("Rating out of bounds");
        return true;
    }),

    editCommmentRule: rule()( async (_, {rating, content}) => {
        if (content.length <= 0 || !textFieldLenCheck(content, 500))
            return new Error("Content should have at least one character and maximum 500 letters");
        if (rating != null && (rating > 5 || rating < 0))
            return new Error("Rating out of bounds");
        return true;
    }),

    isOwnCommenter: rule()( async (_, {_id}, context) => {
        
        const comment = await Comment.findOne({ _id });
        if (comment == null || comment.userEmail != context.getUser().email)
            return new Error('Comment no longer exist or not authorized');
        return true;
    }),
};

module.exports = {
    commentRules,
};