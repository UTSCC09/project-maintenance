/*jshint esversion: 9 */

/**
 * 
 * Reference In General:
 * Graphql Shield: https://www.graphql-shield.com/docs
 * 
 */
const { rule } = require('graphql-shield');
const { Appointment, User } = require('../mongooseSchemas');
const { textFieldLenCheck } = require('./sanitizationRules');

/**
 * Comment on Object
 * 
 * @param appointmentRule 1. Validates description who should have at least one character and maximum 500 letters
 *                        2. Validates user email who should exist
 *                        3. Validates time interval who should be at least 5 minutes and does not conflict
 * @param appointmentEditRule Validates appointment changes like appointment rule but allows optional parameter
 * @param appointmentDeleteRule Only allow upcoming appointment deletion and appointment must exist
 * @param isAppointed Errors if the user is not one of the appointed users
 * @param isAppointedWorker Erros if the user is not the appointed worker
 */
const appointmentRules = {
    appointmentRule: rule()( async (_, {description, userEmail, startTime, endTime}, context) => {
        if (description.length <= 0 || !textFieldLenCheck(description, 500))
            return new Error("Description should have at least one character and maximum 500 letters");

        const user = await User.findOne({email: userEmail});
        if (user == null)
            return new Error("Cannot find user");
        
        if (endTime - 1000 * 60 * 5 < startTime)
            return new Error("Time period too short (less than 5 minutes) or invalid");
        
        const conflictAppointment = await Appointment.findOne({$and: [
            {workerEmail: context.getUser().email},
            {$or: [
            {$and: [{startTime: {$gte: startTime}}, {startTime: {$lt: endTime}}]},
            {$and: [{endTime: {$gt: startTime}}, {endTime: {$lte: endTime}}]},
            {$and: [{startTime: {$lte: startTime}}, {endTime: {$gte: endTime}}]}
        ]}]});
        if (conflictAppointment != null)
            return new Error("Time period conflict");
        return true;
    }),

    appointmentEditRule: rule()( async (_, {_id, description, userEmail, startTime, endTime}, context) => {
        if (description.length <= 0 || !textFieldLenCheck(description, 500))
            return new Error("Description should have at least one character and maximum 500 letters");
        if (userEmail)
            {
                const user = await User.findOne({email: userEmail});
                if (user == null)
                    return new Error("Cannot find user");
            }
        if (!startTime && !endTime)
            return true;
        if (!startTime || !endTime)
            return new Error("Please enter startTime and endTime");

        if (endTime - 1000 * 60 * 5 < startTime)
            return new Error("Time period too short or invalid");
        
        const conflictAppointment = await Appointment.findOne({$and: [
            {workerEmail: context.getUser().email},
            {_id: {$ne: _id}},
            {$or: [
            {$and: [{startTime: {$gte: startTime}}, {startTime: {$lt: endTime}}]},
            {$and: [{endTime: {$gt: startTime}}, {endTime: {$lte: endTime}}]},
            {$and: [{startTime: {$lte: startTime}}, {endTime: {$gte: endTime}}]}
        ]}]});
        if (conflictAppointment != null)
            return new Error("Time period conflict");
        return true;
    }),

    appointmentDeleteRule: rule()( async (_, {_id}) => {
        const curDate = new Date();

        const appointment = await Appointment.findOne({$and :[
            { _id },
            { endTime: { $lte: curDate.getTime() }}
        ]});
        
        if (appointment != null)
            return new Error("No deletion of history");
        return true;

    }),
    
    isAppointed: rule()( async (_, {_id}, context) => {
        const appointment = await Appointment.findOne({ _id });
        if (appointment == null || (appointment.workerEmail != context.getUser().email && appointment.userEmail != context.getUser().email))
            return new Error('Appointment no longer exist or not authorized');
        return true;
    }),

    isAppointedWorker: rule()( async (_, {_id}, context) => {
        const appointment = await Appointment.findOne({ _id });
        if (appointment == null || appointment.workerEmail != context.getUser().email)
            return new Error('Appointment no longer exist or not authorized');
        return true;
    }),
};

module.exports = {
    appointmentRules,
};