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
        location: [Float!]
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
    getPostCount: Int
	getAllPost: [Post]
    getPostPage(postPerPage: Int!, page: Int!): [Post]
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
    location :{
        type: {
            type: String,
            enum: ['Point'], // 'location.type' must be 'Point'
            required: false
          },
          coordinates: {
            type: [Number],
            required: false
          }
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
    async getPostCount(parent, args, context, info){
        return await Post.countDocuments();
    },

    async getPostPage(parent, args, context, info){
        const { postPerPage, page } = args;
        if (page < 0)
            throw new Error("page number undefined");
        if (postPerPage == 0)
            return [];
        return await Post.find({}).sort({ 'createdAt': 1 }).skip(page * postPerPage).limit(postPerPage);
    },
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

