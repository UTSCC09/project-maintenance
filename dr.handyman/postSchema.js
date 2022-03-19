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
        location: [Float!]
        type: Int
        state: Boolean
        createdAt: String
        updatedAt: String
    }
`;

const postMutDef = `
    addPost(title: String!, content: String!, coordinates: [Float!], type: Int!): Post
    acquirePost(_id: String!): Boolean
    unacquirePost(_id: String!): Boolean
    setPost(_id: String!, title: String!, content: String!): Boolean
`;

const postQueryDef = `
    getPostCount: Int
    getOnePost(_id: String!): Post
    getUserPosts: [Post]
    getAcceptedPosts: [Post]
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

const Post = mongoose.model('Post', PostSchema);

const postMut = {
    addPost (parent, args, context, info) {
        const { title, content, coordinates, type} = args;
        const postObj = new Post({
            posterEmail: context.getUser().email,
            posterUsername: context.getUser().username,
            acceptorEmail: "",
            acceptorUsername: "",
            title, 
            content,
            location: {coordinates, type: 'Point'},
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
    },
    async acquirePost(parent, args, context, info){
        const post = await Post.findOne({_id: args._id});
        if (post == null || post.acceptorEmail != "" || post.posterEmail == context.getUser().email)
            throw new Error("Cannot acquire post");
        const res = await Post.updateOne({ _id: args._id },
                                         {acceptorEmail: context.getUser().email,
                                          acceptorUsername: context.getUser().username,
                                          state: 1});
        return res.acknowledged;
    },
    async unacquirePost(parent, args, context, info){
        const post = await Post.findOne({_id: args._id});
        if (post == null || post.acceptorEmail != context.getUser().email)
            throw new Error("Cannot unacquire post");
        const res = await Post.updateOne({ _id: args._id },
                                         {acceptorEmail: "",
                                          acceptorUsername: "",
                                          state: 0});
        return res.acknowledged;
    },
    async setPost(parent, args, context, info){
        const post = await Post.findOne({_id: args._id});
        if (post == null || post.posterEmail != context.getUser().email)
            throw new Error("Cannot unacquire post");
        const { title, content } = args;
        const res = await Post.updateOne({ _id: args._id },
                                         { title: title == null ? post.title : title,
                                           content: content == null ? post.content : content,});
        return res.acknowledged;
    }
};

const postQuery = {
    async getOnePost(parent, args, context, info){
        const post = await Post.findOne({_id: args._id});
        if (post == null)
            throw new Error('Post does not exist');
        return post;
    },

    async getPostCount(parent, args, context, info){
        return await Post.countDocuments();
    },
    async getUserPosts(parent, args, context, info){
        return await Post.find({posterEmail: context.getUser().email});
    },
    async getAcceptedPosts(parent, args, context, info){
        return await Post.find({acceptorEmail: context.getUser().email});
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

