/*jshint esversion: 8 */
/**
 * 
 * Reference In General:
 * Graphql Shield: https://www.graphql-shield.com/docs
 * 
 */
const { chain, rule, shield, deny } = require('graphql-shield');
const { commentRules } = require('./schemaRules/commentRules');
const { appointmentRules } = require('./schemaRules/appointmentRules');
const { userRules } = require('./schemaRules/userRules');
const { postRules } = require('./schemaRules/postRules');

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

const isNotWorker = rule()((parent, args, context) => {
    if (context.getUser().type == "worker")
        return new Error("Already a worker");
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

        signup: userRules.signUpRule,
        profilePicUpload: isAuthenticated,
        createConvo: isAuthenticated,
        createMessage: isAuthenticated,

        setPost: chain(isAuthenticated, postRules.isOwner, postRules.setPostRules),
        acquirePost: chain(isAuthenticated, postRules.notAcquired),
        unacquirePost: chain(isAuthenticated, postRules.isAcquiree),
        addPost: chain(isAuthenticated, postRules.addPostRules),
        deletePost: chain(isAuthenticated, postRules.isOwner),
        
        deleteUser: deny,
        setUser: chain(isAuthenticated, userRules.setUserRUle),
        setWorker: chain(isAuthenticated, isNotWorker),

        addAppointment: chain(isAuthenticated, isWorker, appointmentRules.AppointmentRule),
        deleteAppointment: chain(isAuthenticated, isWorker, appointmentRules.isAppointed, appointmentRules.AppointmentDeleteRule),
        editAppointment: chain(isAuthenticated, isWorker, appointmentRules.isAppointedWorker, appointmentRules.AppointmentEditRule),

        addComment: chain(isAuthenticated, commentRules.addCommmentRule),
        deleteComment: chain(isAuthenticated, commentRules.isOwnCommenter),
        editComment: chain(isAuthenticated, commentRules.isOwnCommenter, commentRules.editCommmentRule),
    },
}, 
    {allowExternalErrors: true, debug: true}
);
module.exports = {
    permissions
};