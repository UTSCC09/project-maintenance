const mongoose  = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        text: true
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          }
    },
    profilePic: {
        filepath: {
            type: String,
            required: false,
        },
        fileGetPath:{
            type: String,
            required: false,
        },
        mimetype: {
            type: String,
            required: false,
        },
        encoding: {
            type: String,
            required: false,
        },
        required: false
    },
    permissions: {
        type: [String],
        required: true
    },
}, { timestamps: true });

const PostSchema = new Schema({
    posterEmail: {
        type: String,
        required: true
    },
    posterUsername: {
        type: String,
        required: true
    },
    acceptorEmail: {
        type: String,
        required: false
    },
    acceptorUsername: {
        type: String,
        required: false
    },
    title: {
        type: String,
        required: true,
        text: true
    },
    content: {
        type: String,
        required: true,
    },
    location: {
        type: {
            type: String,
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          }
    },
    type: {
        type: Number,
        required: true
    },
    state: {
        type: Boolean,
        required: true
    },
}, { timestamps: true });

const ConversationSchema = new Schema({
    userEmails: {
        type: [String],
        required: true
    },
}, { timestamps: true });

const MessageSchema = new Schema({
    conversationId: {
        type: String,
        required: true
    },
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

const AppointmentSchema = new Schema({
    description: {
        type: String,
        required: true
    },
    workerEmail: {
        type: String,
        require: true
    },
    userEmail: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    }
}, { timestamps: true });

const CommentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    appointmentId: {
        type: String,
        required: true
    },
    workerEmail: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        require: true
    }
}, { timestamps: true });

UserSchema.index( { location: "2dsphere" });
PostSchema.index( { location: "2dsphere" } );
const Conversation = mongoose.model('Conversation', ConversationSchema);
const Message = mongoose.model('Message', MessageSchema);
const Post = mongoose.model('Post', PostSchema);
const User = mongoose.model('User', UserSchema);
const Appointment = mongoose.model('Appointment', AppointmentSchema);
const Comment = mongoose.model('Comment', CommentSchema);


module.exports = {
    User,
    Post,
    Conversation,
    Message,
    Appointment,
    Comment,
};