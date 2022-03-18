/*jshint esversion: 8 */

const { and, or, rule, shield } = require('graphql-shield');

function checkPermission(user, permission) {
    if (user && user.permissions){
        return user.permissions.includes(permission);
    }
    return false;
}

const isAuthenticated = rule()((parent, args, context) => {
    return context.isAuthenticated();
});

const permissions = shield({
    Query: {
        currentUser: isAuthenticated,
        getConvo: isAuthenticated,
    },
    Mutation: {
        setWorker: isAuthenticated,
        addPost: isAuthenticated,
        profilePicUpload: isAuthenticated,
        createConvo: isAuthenticated,
        createMessage: isAuthenticated,
        setUser: isAuthenticated,
    },
}, 
    {allowExternalErrors: true}
);
module.exports = {
    permissions
};