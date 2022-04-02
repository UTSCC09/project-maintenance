/*jshint esversion: 8 */

const { chain, rule, shield } = require('graphql-shield');
const { commentRules } = require('./commentSchema');
const { appointmentRules } = require('./appointmentSchema');
function checkPermission(user, permission) {
    if (user && user.permissions){
        return user.permissions.includes(permission);
    }
    return false;
}

const isAuthenticated = rule()((parent, args, context) => {
    if (!context.isAuthenticated())
        return new Error("Not Authorized");
    return true;
});

const isWorker = rule()((parent, args, context) => {
    if (context.getUser().type != "worker")
        return new Error("Not a worker");
    return true;
});

const permissions = shield({
    Query: {
        currentUser: isAuthenticated,
        getOneConvo: isAuthenticated,
        getCurrentConvos: isAuthenticated,
        getUserPostsPage: isAuthenticated,
        getAcceptedPostsPage: isAuthenticated,
        getUserPostCount: isAuthenticated,
        getAcceptedPostCount: isAuthenticated

    },
    Mutation: {
        setPost: isAuthenticated,
        acquirePost: isAuthenticated,
        unacquirePost: isAuthenticated,
        setWorker: isAuthenticated,
        addPost: isAuthenticated,
        profilePicUpload: isAuthenticated,
        createConvo: isAuthenticated,
        createMessage: isAuthenticated,
        setUser: isAuthenticated,
        deletePost: isAuthenticated,

        addAppointment: chain(isAuthenticated, isWorker, appointmentRules.AppointmentRule),
        deleteAppointment: chain(isAuthenticated, isWorker, appointmentRules.isAppointed, appointmentRules.AppointmentDeleteRule),
        editAppointment: chain(isAuthenticated, isWorker, appointmentRules.isAppointed, appointmentRules.AppointmentRule),

        addComment: chain(isAuthenticated, commentRules.addCommmentRule),
        deleteComment: chain(isAuthenticated, commentRules.isOwnCommenter),
        editComment: chain(isAuthenticated, commentRules.isOwnCommenter),
    },
}, 
    {allowExternalErrors: true, debug: true}
);
module.exports = {
    permissions
};