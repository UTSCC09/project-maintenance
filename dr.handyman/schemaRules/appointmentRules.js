/*jshint esversion: 9 */
const { rule } = require('graphql-shield');
const { Appointment, User } = require('../mongooseSchemas');

const appointmentRules = {
    AppointmentRule: rule()( async (parent, {description, userEmail, startTime, endTime}, context) => {
        const user = await User.findOne({email: userEmail});
        if (user == null)
            return new Error("Cannot find user");
        
        if (endTime - 1000 * 60 * 5 < startTime)
            return new Error("Time period too short or invalid");
        
        const conflictAppointment = await Appointment.findOne({$and: [
            {workerEmail: context.getUser().email},
            {$or: [
            {$and: [{startTime: {$gte: startTime}}, {startTime: {$lt: endTime}}]},
            {$and: [{endTime: {$gt: startTime}}, {endTime: {$lte: endTime}}]},
            {$and: [{startTime: {$lte: startTime}}, {endTime: {$gte: endTime}}]}
        ]}]});
        if (conflictAppointment != null)
            return new Error("Time period conflict");
        return true
    }),

    AppointmentEditRule: rule()( async (parent, {_id, description, userEmail, startTime, endTime}, context) => {
        if (userEmail)
            {
                const user = await User.findOne({email: userEmail});
                if (user == null)
                    return new Error("Cannot find user");
            }
        if (!startTime && !endTime)
            return true;
        if (!startTime || !endTime)
            return new Error("Please enter startTime and endTime")

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
        return true
    }),

    AppointmentDeleteRule: rule()( async (parent, {_id}, context) => {
        const curDate = new Date();

        const appointment = await Appointment.findOne({$and :[
            { _id },
            { endTime: { $lte: curDate.getTime() }}
        ]});
        
        if (appointment != null)
            return new Error("No deletion of history");
        return true

    }),
    
    isAppointed: rule()( async (parent, {_id}, context) => {
        const appointment = await Appointment.findOne({ _id });
        if (appointment == null || (appointment.workerEmail != context.getUser().email && appointment.userEmail != context.getUser().email))
            return new Error('Appointment no longer exist or not authorized');
        return true;
    }),

    isAppointedWorker: rule()( async (parent, {_id}, context) => {
        const appointment = await Appointment.findOne({ _id });
        if (appointment == null || appointment.workerEmail != context.getUser().email)
            return new Error('Appointment no longer exist or not authorized');
        return true;
    }),
};

module.exports = {
    appointmentRules,
};