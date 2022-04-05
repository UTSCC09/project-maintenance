/*jshint esversion: 9 */
const { rule } = require('graphql-shield');
const { Comment, Appointment, User } = require('../mongooseSchemas');

const commentRules = {
    addCommmentRule: rule()( async (parent, {appointmentId, workerEmail, rating, content}, context) => {

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
            return new Error("Cannot comment yourself")

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

    isOwnCommenter: rule()( async (parent, {_id}, context) => {
        
        const comment = await Comment.findOne({ _id });
        if (comment == null || comment.userEmail != context.getUser().email)
            return new Error('Comment no longer exist or not authorized');
        return true;
    }),
};

module.exports = {
    commentRules,
};