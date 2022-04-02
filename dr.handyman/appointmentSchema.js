/*jshint esversion: 9 */
const { Appointment, User, Comment } = require('./mongooseSchemas');
const { rule } = require('graphql-shield');

const appointmentDefs = `
    type Appointment {
        _id: String
        description: String
        workerEmail: String
        userEmail: String
        startTime: String
        endTime: String
    }
`;

const appointmentMutDef = `
    addAppointment(description: String!, userEmail: String!, startTime: Float!, endTime: Float!): Appointment
    deleteAppointment(_id: String!): Boolean
    editAppointment(_id: String!, description: String, userEmail: String, startTime: Float, endTime: Float): Boolean
`;

const appointmentQueryDef = `
    getAppointmentHistoryPage(email: String!, appointmentPerPage: Int!, page: Int!): [Appointment]
    getAppointmentHistoryCount(email: String!): Int

    getAppointmentUpComingPage(email: String!, appointmentPerPage: Int!, page: Int!): [Appointment]
    getAppointmentUpComingCount(email: String!): Int
`;

const appointmentQuery = {
    async getAppointmentHistoryPage(parent, {email, appointmentPerPage, page}, context, info){
        if (page < 0)
            throw new Error("page number undefined");
        if (appointmentPerPage == 0)
            return [];
        const curDate = new Date();
        const appointments = await Appointment.find({ $and: [{ $or: [ { userEmail: email }, 
                                                               { workerEmail: email } ] },
                                                        {endTime: { $lte: curDate.getTime() }}]}).sort({ 'startTime': -1 }).skip(page * appointmentPerPage).limit(appointmentPerPage);
        return appointments;
    },

    async getAppointmentUpComingPage(parent, {email, appointmentPerPage, page}, context, info){
        if (page < 0)
            throw new Error("page number undefined");
        if (appointmentPerPage == 0)
            return [];
        const curDate = new Date();
        const appointments = await Appointment.find({ $and: [{ $or: [ { userEmail: email }, 
                                                               { workerEmail: email } ] },
                                                        {endTime: { $gt: curDate.getTime() }}]}).sort({ 'startTime': 1 }).skip(page * appointmentPerPage).limit(appointmentPerPage);
        return appointments;
    },

    async getAppointmentHistoryCount(parent, {email}, context, info){
        const curDate = new Date();
        return await Appointment.countDocuments({ $and: [{ $or: [ { userEmail: email }, 
                                                    { workerEmail: email } ] },
                                            {endTime: { $lte: curDate.getTime() }}]});
    },
    async getAppointmentUpComingCount(parent, {email}, context, info){
        const curDate = new Date();
        return await Appointment.countDocuments({ $and: [{ $or: [ { userEmail: email }, 
                                                    { workerEmail: email } ] },
                                            {endTime: { $gt: curDate.getTime() }}]});
    },

}

const appointmentMut = {
    async addAppointment(parent, {description, userEmail, startTime, endTime}, context, info){
        const aptObj = new Appointment({
            description,
            userEmail,
            workerEmail: context.getUser().email,
            startTime: new Date(startTime),
            endTime: new Date(endTime)
        });
        return aptObj.save()
            .then (result => {
                return { ...result._doc };
            })
            .catch (err => {
                throw new Error("Add appointment failed");
            });
    },
    async deleteAppointment(parent, {_id}, context, info){
        return  Appointment.deleteOne({ _id }).then(result => {
            return result.deletedCount;
        })
        .catch (err => {
            throw new Error("Appointment deletion failed");
        });
    },
    async editAppointment(parent, {_id, description, userEmail, startTime, endTime}, context, info){
        const appointment = await Appointment.findOne({ _id });
        const res = await Appointment.updateOne({ _id },
                                         { description: description == null ? appointment.description : description,
                                            userEmail: userEmail == null ? appointment.userEmail : userEmail,
                                            startTime: startTime == null ? appointment.startTime : new Date(startTime),
                                            endTime: endTime == null ? appointment.endTime : new Date(endTime),});
        return res.acknowledged;
    }
};

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
    
    isAppointedWorker: rule()( async (parent, {_id}, context) => {
        const appointment = await Appointment.findOne({ _id });
        if (appointment == null || appointment.workerEmail != context.getUser().email)
            return new Error('Appointment no longer exist or not authorized');
        return true;
    }),
};

module.exports = {
    Appointment,
    appointmentDefs,
    appointmentMutDef,
    appointmentQueryDef,
    appointmentQuery,
    appointmentMut,
    appointmentRules,
};