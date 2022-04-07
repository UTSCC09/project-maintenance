/*jshint esversion: 9 */

const bcrypt = require('bcrypt');
const { passwordValidate, stripXss, textFieldLenCheck, emailValidate, unmodifiableValidate, phoneValidate } = require('./schemaRules/sanitizationRules');
const { permissions } = require('./permissions');
const { gql } = require('apollo-server-express');
const { applyMiddleware } = require('graphql-middleware');
const { makeExecutableSchema }  = require('@graphql-tools/schema');
const { userMutDef, userQueryDef, userDefs, User, userMut, userQuery } = require('./userSchema');
const { postMutDef, postDefs, Post, postMut, postQuery, postQueryDef } = require('./postSchema');
const { chatMutDef, chatQueryDef, chatDefs, Conversation, Message, chatMut, chatQuery } = require('./chatSchema');
const { fileUploadDef, fileUploadMut, fileUploadMutDef, fileUploadQueryDef, fileUploadScalar } = require('./userProfilePicUpload');
const { Appointment, appointmentDefs, appointmentMutDef, appointmentQueryDef, appointmentQuery, appointmentMut} = require('./appointmentSchema');
const { Comment, commentDefs, commentMutDef, commentQueryDef, commentMut, commentQuery} = require('./commentSchema');

/**
 * Create a user from the sign up information.
 * @param {Object} object containing email, password, username, and phone to create
 * a valid user.
 * @returns newly created user
 * @throws errors if mongo user creation failed.
 */
async function addUser ({ email, password, username, phone }) {
    const userObj = new User({
        email, password, username,
        type: "user",
        phone,
        rating: 5,
        permissions: [],
        location: {coordinates: [0,0], type: 'Point'},
    });
    return userObj.save()
        .then (result => {
            return { ...result._doc };
        })
        .catch (err => {
            throw new Error('User Creation failed');
        });
}

const typeDefs = gql(`
    # Type Defs
    type AuthPayload {
        user: User
    }
    ` + 
    userDefs + 
    postDefs + 
    chatDefs +
    fileUploadDef +
    appointmentDefs +
    commentDefs +
    `

    # Query types
    type Query {
        """
        Get current user information
        """
        currentUser: User` + 
        chatQueryDef +
        postQueryDef +
        fileUploadQueryDef +
        userQueryDef +
        appointmentQueryDef +
        commentQueryDef +
        `
    }

    # Mutation Types
    type Mutation {
        """
        Logs in user with passport context.
        """
        login(email: String!, password: String!): AuthPayload
        """
        Signup user with passport context. Does not auto signin.
        """
        signup(username: String!, email: String!, password: String!, phone: String!): AuthPayload
        """
        Logout user.
        """
        logout: Boolean`+ 
        userMutDef + 
        postMutDef + 
        chatMutDef +
        fileUploadMutDef +
        appointmentMutDef +
        commentMutDef +
        `
    }

    type Subscription {
        """
        Subscription service that getChat through the conversation channel on publish.
        Automatically publish messages on the first call.
        """
        getChat(conversationId: String!, count: Int!): [Message]
    }
`
);

/**
 * Comments on object:
 * 
 * @param Upload check fileUploadSchema for more detail
 * @param Subscription.getChat subscription 
 */
const resolvers = {
    Upload: fileUploadScalar.Upload,
    Subscription: {
        getChat: {
            subscribe: (parent, args, context) => {  
            if (context.email == null)
                throw new Error("Unauthorized");
            else{
                setTimeout(async () => context.pubsub.publish(args.conversationId, {
                    getChat: await Message.find({ conversationId: args.conversationId })
                }), 0);
                return context.pubsub.asyncIterator(args.conversationId);
            }
            }
        }
    },
    Mutation: {
        login: async (parent, { email, password }, context) => {
            const { user } = await context.authenticate('graphql-local', { email, password });
            await context.login(user);
            return { user };
        },
        logout: (parent, args, context) => context.logout(),
        signup: async (parent, { username, email, password, phone}, context) => {
            if (!emailValidate(email) || stripXss(email) != email)
                throw new Error("Invalid Email");
            if (username.length <= 0 || !textFieldLenCheck(username, 20) || !unmodifiableValidate(username) || stripXss(username) != username)
                throw new Error("Username should contain alphanumerics and be less than or equal to 20 letters");
            if (!passwordValidate(password))
                throw new Error("Password should be minimum 8 characters with no spaces, lower case, upper case, a number, and a symbol");
            if (!phoneValidate(phone))
                throw new Error("Phone number invalid");

            const existUser = await User.findOne({ email: email});
            if (existUser) {
                throw new Error('User with email already exists');
            }
            const doSignup = () => new Promise((resolve, reject) => {
                bcrypt.genSalt(10, function(err, salt) {
                    if (err) reject(Error('salt gen failed'));
                    bcrypt.hash(password, salt, async (err, hash) => {
                        if (err) reject(Error('hash failed'));
                        const newUser = await addUser({email, username, password: hash, phone});
                        // await context.login(newUser);
                        resolve({ user: newUser });
                    });
                });
            });
            return await doSignup();
        },
    },

    Query: {
        currentUser: (parent, args, context) => context.getUser(),
    },
};

// Appends query and mutation schemas from other schemas.
resolvers.Mutation = Object.assign({}, resolvers.Mutation, userMut, postMut, chatMut, fileUploadMut, appointmentMut, commentMut);
resolvers.Query = Object.assign({}, resolvers.Query, chatQuery, postQuery, userQuery, appointmentQuery, commentQuery);

const schema = applyMiddleware(
    makeExecutableSchema({
        typeDefs,
        resolvers
    }),
    permissions
);

module.exports = {
    schema,
    User,
    Post,
    Conversation,
    Message,
    Appointment,
    Comment
};
