/*jshint esversion: 9 */

const mongoose  = require('mongoose');
const { Schema } = mongoose;
const { Post } = require('./mongooseSchemas');

var rad = function(x) {
    return x * Math.PI / 180;
};
  
var getDistance = function(p1, p2) {
    // 1 is lat, 0 is long
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = rad(p2[1] - p1[1]);
    var dLong = rad(p2[0] - p1[0]);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(p1[1])) * Math.cos(rad(p2[1])) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d; // returns the distance in meter
};

const postDefs = `
    type Post {
        _id: String
        posterEmail: String
        posterUsername: String
        acceptorEmail: String
        acceptorUsername: String
        title: String
        content: String
        distance: Float
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
    deletePost(_id: String!): Boolean
`;

const postQueryDef = `
    getPostCount: Int
    getOnePost(_id: String!, coordinates: [Float]): Post

    getUserPostsPage(userPostPerPage: Int!, page: Int!): [Post]
    getUserPostsPageByEmail(email: String!, userPostPerPage: Int!, page: Int!): [Post]
    getAcceptedPostsPage(acceptedPostPerPage: Int!, page: Int!): [Post]
    getAcceptedPostsPageByEmail(email: String!, acceptedPostPerPage: Int!, page: Int!): [Post]

    getUserPostCount: Int
    getUserPostCountByEmail(email: String!): Int
    getAcceptedPostCount: Int
    getAcceptedPostCountByEmail(email: String!): Int
    
	getAllPost: [Post]
    getPostPage(postPerPage: Int!, page: Int!): [Post]

    searchPostPage(queryText: String!, postPerPage: Int!, page: Int!): [Post]
    searchPostPageCount(queryText: String!): Int
`;

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
    },
    async deletePost(parent, args, context, info){
        const post = await Post.findOne({_id: args._id});
        if (post == null || post.posterEmail != context.getUser().email)
            throw new Error('Post no longer exist or not authorized');
        return Post.deleteOne({_id: args._id}).then(result => {
                return  result.deletedCount;
            })
            .catch (err => {
                throw new Error("Post deletion failed");
            });
    },
};

const postQuery = {
    async getOnePost(parent, args, context, info){
        const post = await Post.findOne({_id: args._id});
        if (post == null)
            throw new Error('Post does not exist');
        post["distance"] = null;
        if (args.coordinates != null && args.coordinates != undefined && args.coordinates.length == 2
            && typeof args.coordinates[0] === "number" && typeof args.coordinates[1] === "number"){
                post["distance"] = getDistance(args.coordinates, post.location.coordinates) / 1000;
            }
        return post;
    },

    async getPostCount(parent, args, context, info){
        return await Post.countDocuments();
    },
    async getUserPostsPage(parent, args, context, info){
        const { userPostPerPage, page } = args;
        if (page < 0)
            throw new Error("page number undefined");
        if (userPostPerPage == 0)
            return [];
        return await Post.find({posterEmail: context.getUser().email}).sort({ 'createdAt': 1 }).skip(page * userPostPerPage).limit(userPostPerPage);
    },
    async getUserPostsPageByEmail(parent, args, context, info){
        const { email, userPostPerPage, page } = args;
        if (page < 0)
            throw new Error("page number undefined");
        if (userPostPerPage == 0)
            return [];
        return await Post.find({posterEmail: email}).sort({ 'createdAt': 1 }).skip(page * userPostPerPage).limit(userPostPerPage);
    },
    async getAcceptedPostsPage(parent, args, context, info){
        const { acceptedPostPerPage, page } = args;
        if (page < 0)
            throw new Error("page number undefined");
        if (acceptedPostPerPage == 0)
            return [];
        return await Post.find({acceptorEmail: context.getUser().email}).sort({ 'createdAt': 1 }).skip(page * acceptedPostPerPage).limit(acceptedPostPerPage);
    },
    async getAcceptedPostsPageByEmail(parent, args, context, info){
        const { email, acceptedPostPerPage, page } = args;
        if (page < 0)
            throw new Error("page number undefined");
        if (acceptedPostPerPage == 0)
            return [];
        return await Post.find({acceptorEmail: email}).sort({ 'createdAt': 1 }).skip(page * acceptedPostPerPage).limit(acceptedPostPerPage);
    },
    async getUserPostCount(parent, args, context, info){
        return await Post.countDocuments({posterEmail: context.getUser().email});
    },
    async getUserPostCountByEmail(parent, args, context, info){
        return await Post.countDocuments({posterEmail: args.email});
    },
    async getAcceptedPostCount(parent, args, context, info){
        return await Post.countDocuments({acceptorEmail: context.getUser().email});
    },
    async getAcceptedPostCountByEmail(parent, args, context, info){
        return await Post.countDocuments({acceptorEmail: args.email});
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
    },

    async searchPostPage(parent, args, content, info){
        const { queryText, postPerPage, page } = args;
        if (page < 0)
            throw new Error("page number undefined");
        if (postPerPage == 0)
            return [];
        return await Post.find({ $text: {$search: queryText } }).sort({ score: {$meta: "textScore" } }).skip(page * postPerPage).limit(postPerPage);
    },
    async searchPostPageCount(parent, args, content, info){
        return await Post.countDocuments({ $text: {$search: args.queryText }});
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

