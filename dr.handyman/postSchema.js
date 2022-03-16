/*jshint esversion: 9 */

const mongoose  = require('mongoose');
const { Schema } = mongoose;

const postDefs = `
    type Post {
        _id: String
        posterEmail: String
        posterUsername: String
        acceptorEmail: String
        acceptorUsername: String
        title: String
        content: String
        region: String
        type: Int
        state: Boolean
        createdAt: String
        updatedAt: String
    }
`;

/**
 * add post
 * delete post
 * acquire post
 * unacquire post
 * edit post
 */
const postMutDef = `
    addPost(title: String!, content: String!, region: String!, type: Int!): Post
`;

const postQueryDef = `
	getAllPost: [Post]
`;

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
        required: true
    },
    content: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
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

const Post = mongoose.model('Post', PostSchema);

const postMut = {
    addPost (parent, args, context, info) {
        const { title, content, region, type} = args;
        const postObj = new Post({
            posterEmail: context.getUser().email,
            posterUsername: context.getUser().username,
            title, 
            content,
            region,
            type,
            state: 0,
        });
        return postObj.save()
            .then (result => {
                return { ...result._doc };
            })
            .catch (err => {
                console.error(err);
            });
    }
};

const postQuery = {
	async getAllPost(parent, args, context, info){
        const posts = await Post.find({});
        if (posts == null)
            throw new UserInputError("post does not exist");
        return posts;
    }
}

module.exports = {
    postDefs,
    postMutDef,
    Post,
    postMut,
    postQuery,
    postQueryDef
};

