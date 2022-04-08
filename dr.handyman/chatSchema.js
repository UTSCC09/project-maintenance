/*jshint esversion: 9 */

/**
 * 
 * Reference in general
 * Mongoose Docs: https://mongoosejs.com/docs/guide.html
 * Apollo Docs: https://www.apollographql.com/docs/apollo-server/
 *  
 */
const { Conversation, Message, User } = require('./mongooseSchemas');
const { stripXss, textFieldLenCheck } = require('./schemaRules/sanitizationRules');

const chatDefs = `
    """
    Conversation object type
    """
    type Conversation {
        _id: String
        userEmails: [String]
    }

    """
    Conversation object embedded with usernames
    """
    type ConversationDescrciption {
        username1: String!
        username2: String!
        conversation: Conversation!
    }

    """
    Message Object
    """
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
    """
    Create conversation between the current user and the email user
    """
    createConvo(email: String!): Conversation

    """
    Create a message in the conversation
    """
    createMessage(_id: String!, content: String!): Boolean
`;
const chatQueryDef = `
    """
    Get a conversation by id
    """
    getOneConvo(_id: String!): Conversation

    """
    Gets the list of conversations of the current user
    """
    getCurrentConvos: [Conversation]

    """
    Gets the list of conversations with username embedded of the current user
    """
    getCurrentConvosWithDescription: [ConversationDescrciption]

    """
    Gets the Latest messages of current user.
    """
    getLatestMessage(_id: String!): Message

    """
    Gets all messages for this id
    """
    getAllMessage(_id: String!): [Message]
`;

/**
 * Note: Graphql operations handle thrown errors automatically. Graphql Shield has taken care
 *       of authorization and sanitization
 * Comments on object:
 * 
 * @param createConvo Creates a communication channel/id where the current user and user specified by
 *                    email can communicate. If channel already exist, return the existing channel
 * @param createMessage Publishes a message with content onto channel _id.
 */
const chatMut = {
    async createConvo(_, { email }, context){
        const user = await User.findOne({ email: email });
        if (user == null || user.email == context.getUser().email)
            throw new Error("End users does not exist");

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
    async createMessage(_, { _id, content }, context){
        if (content.length <= 0 || !textFieldLenCheck(content, 500))
            throw new Error("Content should have at least one character and maximum 500 letters")

        content = stripXss(content);
        const messageObj = new Message({
            conversationId: _id,
            email: context.getUser().email,
            username: context.getUser().username,
            content: content,
        });
        
        await messageObj.save();
        await Conversation.updateOne({_id}, {_id: _id});
        context.pubsub.publish(_id, {
            getChat: await Message.find({ conversationId: _id }).sort({ 'createdAt': -1 })
        });
        return true;
    }
};

/**
 * Note: Graphql operations handle thrown errors automatically. Graphql Shield has taken care
 *       of authorization and sanitization
 * Comments on object:
 * 
 * @param getOneConvo Returns a conversation object specified by _id
 * @param getCurrentConvos Returns a list of conversation objects associated with the current user.
 *                         Results sorted by earliest update time.
 * @param getCurrentConvosWithDescription Same as getCurrentConvos but each object embeds username.
 * @param getLatestMessage Returns the latest message in a conversation channel. Sorted by earliest creation time.
 * @param getAllMessage Returns all messages in this conversation.
 * 
 */
const chatQuery = {
    async getOneConvo(_, { _id }){
        const conv = await Conversation.findOne({ _id});
        if (conv == null)
            throw new Error("conversation does not exist");
        return conv;
    },
    async getCurrentConvos(_, __, context){
        return await Conversation.find({userEmails: context.getUser().email}).sort({ 'updatedAt': -1 });
    },
    async getCurrentConvosWithDescription(_, __, context){
        const conversations = await Conversation.find({userEmails: context.getUser().email}).sort({ 'updatedAt': -1 });
        const convDescriptions = [];
        await Promise.all(conversations.map(async (elem) => {
            const user1 = await User.findOne({email: elem.userEmails[0]});
            const user2 = await User.findOne({email: elem.userEmails[1]});
            convDescriptions.push({username1: user1.username, username2: user2.username, conversation: elem});
        }));
        return convDescriptions;
    },
    async getLatestMessage(_, {_id}){
        const latestMessage = await Message.find({conversationId: _id}).sort({ 'createdAt': -1 }).limit(1);
        if (latestMessage.length != 1)
            return null;
        return latestMessage[0];
    },
    async getAllMessage(_, {_id}){
        return await Message.find({ conversationId: _id }).sort({ 'createdAt': -1 })
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

