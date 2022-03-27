/*jshint esversion: 9 */

const mongoose  = require('mongoose');
const { Conversation, Message, User } = require('./mongooseSchemas');
const { UserInputError } = require('apollo-server'); 
// https://stackoverflow.com/questions/14040562/how-to-search-in-array-of-object-in-mongodb
const chatDefs = `
    type Conversation {
        _id: String
        userEmails: [String]
    }
    type ConversationDescrciption {
        username1: String!
        username2: String!
        conversation: Conversation!
    }
    type Message {
        _id: String
        conversationId: String
        email: String
        username: String
        content: String
        createdAt: String
        updatedAt: String
    }
`;

const chatMutDef = `
    createConvo(email: String!): Conversation
    createMessage(_id: String!, content: String!): Boolean
`;
const chatQueryDef = `
    getOneConvo(_id: String!): Conversation
    getCurrentConvos: [Conversation]
    getCurrentConvosWithDescription: [ConversationDescrciption]
    getLatestMessage(_id: String!): Message
`;

const chatMut = {
    async createConvo(parent, args, context, info){
        const { email } = args;
        const user = await User.findOne({ email: email });
        if (user == null || user.email == context.getUser().email)
            throw new UserInputError("End users does not exist");
        const convo = await Conversation.findOne({ $or: [{userEmails: [email, context.getUser().email]},
                                                         {userEmails: [context.getUser().email, email]}]});
        if (convo != null)
            return convo;
        const conversationObj = new Conversation({
            userEmails: [email , context.getUser().email]
        });
        return conversationObj.save()
            .then (result => {
                return { ...result._doc };
            })
            .catch (err => {
                console.error(err);
            });
    },
    async createMessage(parent, args, context, info){
        const { _id, content } = args;
        const messageObj = new Message({
            conversationId: _id,
            email: context.getUser().email,
            username: context.getUser().username,
            content: content,
        });
        await messageObj.save();
        context.pubsub.publish(_id, {
            getChat: await Message.find({ conversationId: _id })
        });
        return true;
    }
};

const chatQuery = {
    async getOneConvo(parent, args, context, info){
        const { _id } = args;
        const conv = await Conversation.findOne({ _id: _id});
        if (conv == null)
            throw new UserInputError("conversation does not exist");
        return conv;
    },
    async getCurrentConvos(parent, args, context, info){
        return await Conversation.find({userEmails: context.getUser().email});
    },
    async getCurrentConvosWithDescription(parent, args, context, info){
        const conversations = await Conversation.find({userEmails: context.getUser().email});
        const convDescriptions = [];
        await Promise.all(conversations.map(async (elem) => {
            const user1 = await User.findOne({email: elem.userEmails[0]});
            const user2 = await User.findOne({email: elem.userEmails[1]});
            convDescriptions.push({username1: user1.username, username2: user2.username, conversation: elem});
        }));
        return convDescriptions;
    },
    async getLatestMessage(parent, args, context, info){
        const latestMessage = await Message.find({conversationId: args._id}).sort({ 'createdAt': -1 }).limit(1);
        if (latestMessage.length != 1)
            return null;
        return latestMessage[0];
    }   
};

module.exports = {
    chatDefs,
    chatMutDef,
    chatQueryDef,
    Conversation,
    Message,
    chatMut,
    chatQuery,
};

