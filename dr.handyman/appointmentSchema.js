/*jshint esversion: 9 */

/**
 * 
 * Reference in general
 * Mongoose Docs: https://mongoosejs.com/docs/guide.html
 * Apollo Docs: https://www.apollographql.com/docs/apollo-server/
 *  
 */
const { Appointment, Comment } = require('./mongooseSchemas');
const { stripXss } = require('./schemaRules/sanitizationRules');
/**
 * Adds the status code on whether or not an appointment is commented
 * @param {Array} inputList appointment objects to be added
 * @returns updated list
 */
async function addIsCommented (inputList){
    await Promise.all(inputList.map(async (appointment) => {
        try {
            const count = await Comment.countDocuments({appointmentId: appointment._id})
            appointment.isCommented = count != 0;
            return appointment;
        } catch (error) {
            throw new Error("Comment status request failed");
        }
    }))
    return inputList
}

const appointmentDefs = `
    """
    Appointment Object
    """
    type Appointment {
        _id: String
        description: String
        workerEmail: String
        userEmail: String
        isCommented: Boolean
        startTime: String
        endTime: String
    }
`;

const appointmentMutDef = `
    """
    Adds an appointment to the current worker's schedule.
    """
    addAppointment(description: String!, userEmail: String!, startTime: Float!, endTime: Float!): Appointment

    """
    Deletes an appointment from the worker's schedule
    """
    deleteAppointment(_id: String!): Boolean

    """
    Updates the appointment from worker's schedule
    """
    editAppointment(_id: String!, description: String, userEmail: String, startTime: Float, endTime: Float): Appointment
`;

const appointmentQueryDef = `
    """
    Gets a page of the appointment history of the user specified by email
    """
    getAppointmentHistoryPage(email: String!, appointmentPerPage: Int!, page: Int!): [Appointment]

    """
    Gets the count of the appointment history of user specified by email
    """
    getAppointmentHistoryCount(email: String!): Int

    """
    Gets a page of upcoming appointments of the user specified by email
    """
    getAppointmentUpComingPage(email: String!, appointmentPerPage: Int!, page: Int!): [Appointment]

    """
    Gets the count of upcoming appointments of the user specified by email
    """
    getAppointmentUpComingCount(email: String!): Int
`;

/**
 * Note: Graphql operations handle thrown errors automatically. Graphql Shield has taken care
 *       of authorization and sanitization
 * Comments on object:
 * 
 * @param getAppointmentHistoryPage Gets a page of appointment history for user specified by email. Sorted in start time
 * @param getAppointmentUpComingPage Gets a page of upcoming history for user specified by email. Sorted in start time
 * @param getAppointmentHistoryCount Gets count of appointment history for user specified by email.
 * @param getAppointmentUpComingCount Gets count of up coming appointment for user specified by email 
 * 
 */
const appointmentQuery = {
    async getAppointmentHistoryPage(_, {email, appointmentPerPage, page}){
        if (page < 0)
            throw new Error("page number undefined");
        if (appointmentPerPage == 0)
            return [];
        const curDate = new Date();
        const appointments = await Appointment.find({ $and: [{ $or: [ { userEmail: email }, 
                                                               { workerEmail: email } ] },
                                                        {endTime: { $lte: curDate.getTime() }}]}).sort({ 'startTime': -1 }).skip(page * appointmentPerPage).limit(appointmentPerPage);
        return addIsCommented (appointments);
    },

    async getAppointmentUpComingPage(_, {email, appointmentPerPage, page}){
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

    async getAppointmentHistoryCount(_, {email}){
        const curDate = new Date();
        return await Appointment.countDocuments({ $and: [{ $or: [ { userEmail: email }, 
                                                    { workerEmail: email } ] },
                                            {endTime: { $lte: curDate.getTime() }}]});
    },
    async getAppointmentUpComingCount(_, {email}){
        const curDate = new Date();
        return await Appointment.countDocuments({ $and: [{ $or: [ { userEmail: email }, 
                                                    { workerEmail: email } ] },
                                            {endTime: { $gt: curDate.getTime() }}]});
    },

}

/**
 * Note: Graphql operations handle thrown errors automatically. Graphql Shield has taken care
 *       of authorization and sanitization
 * Comments on object:
 * 
 * @param addAppointment Adds an appointment with user specified by user email in time period startTime -> endTime
 * @param deleteAppointment Deletes an appointment specified by _id. No comment deletion required as only history
 *                          comment can be commented and history cannot be deleted
 * @param editAppointment Updates the appointment with new information
 * 
 */
const appointmentMut = {
    async addAppointment(_, {description, userEmail, startTime, endTime}, context){
        description = stripXss(description);
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
    async deleteAppointment(_, {_id}){
        return  Appointment.deleteOne({ _id }).then(result => {
            return result.deletedCount;
        })
        .catch (err => {
            throw new Error("Appointment deletion failed");
        });
    },
    async editAppointment(_, {_id, description, userEmail, startTime, endTime}){
        description = stripXss(description);
        const appointment = await Appointment.findOne({ _id });
        const res = await Appointment.updateOne({ _id },
                                         { description: description == null ? appointment.description : description,
                                            userEmail: userEmail == null ? appointment.userEmail : userEmail,
                                            startTime: startTime == null ? appointment.startTime : new Date(startTime),
                                            endTime: endTime == null ? appointment.endTime : new Date(endTime),});
        if (!res.acknowledged)
            return new Error("Update Failed");
        const updatedAppointment = await Appointment.findOne({ _id });
        if (!updatedAppointment)
            return new Error("Appointment does not exist anymore")
        return updatedAppointment;
    }
};

module.exports = {
    Appointment,
    appointmentDefs,
    appointmentMutDef,
    appointmentQueryDef,
    appointmentQuery,
    appointmentMut,
};