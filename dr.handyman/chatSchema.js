const mongoose  = require('mongoose');
const { Schema } = mongoose;

const chatDefs = `
type Conversation {
}

type Messages {

}`

const chatMutDef = `

    `

const ConversationSchema = new Schema();
const MessageSchema = new Schema();

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

