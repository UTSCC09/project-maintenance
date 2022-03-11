const mongoose  = require('mongoose');
const { Schema } = mongoose;

// https://stackoverflow.com/questions/14040562/how-to-search-in-array-of-object-in-mongodb
const chatDefs = `
type Conversation {
    _id: String
    userEmails: [String]
}

type Messages {
    _id: String
    conversationId: String
    email: String
    username: String
    content: String
    createdAt: String
    updatedAt: String
}
`

const chatMutDef = `

    `

const ConversationSchema = new Schema({
    userEmails: {
        type: [String],
        required: true
    },
});
const MessageSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
}, { timestamps: true });

const Conversation = mongoose.model('Conversation', ConversationSchema);
const Message = mongoose.model('Message', MessageSchema);

const chatMut = {
}

module.exports = {
    chatDefs,
    chatMutDef,
    Conversation,
    Message,
    chatMut,
}

