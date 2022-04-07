/*jshint esversion: 9 */
/**
 * 
 * Reference in general
 * Mongoose Docs: https://mongoosejs.com/docs/guide.html
 * Apollo Docs: https://www.apollographql.com/docs/apollo-server/
 *  
 */
const { Post } = require('./mongooseSchemas');
const { addDistances, getDistance, coordinateCheck } = require('./algorithms/distance');
const { stripXss } = require('./schemaRules/sanitizationRules');

const postDefs = `
    """
    Post object type
    """
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
    """
    Adds a post owned by the current user.
    """
    addPost(title: String!, content: String!, coordinates: [Float!], type: Int!): Post

    """
    Aquires the post identified by _id
    """
    acquirePost(_id: String!): Boolean

    """
    Unacquires the post identified by _id
    """
    unacquirePost(_id: String!): Boolean

    """
    Updates the post specified by _id and return the updated post
    """
    setPost(_id: String!, title: String!, content: String!): Post

    """
    Deletes the post specified by _id
    """
    deletePost(_id: String!): Boolean
`;

const postQueryDef = `
    

    """
    Returns one post specified by _id
    """
    getOnePost(_id: String!, coordinates: [Float]): Post

    # This list gets post pages in different ways, names are self explanatory
    getUserPostsPage(userPostPerPage: Int!, page: Int!, coordinates: [Float]): [Post]
    getUserPostsPageByEmail(email: String!, userPostPerPage: Int!, page: Int!, coordinates: [Float]): [Post]
    getAcceptedPostsPage(acceptedPostPerPage: Int!, page: Int!, coordinates: [Float]): [Post]
    getAcceptedPostsPageByEmail(email: String!, acceptedPostPerPage: Int!, page: Int!, coordinates: [Float]): [Post]

    # This list gets post counts in different ways, names are self explanatory
    getUserPostCount: Int
    getUserPostCountByEmail(email: String!): Int
    getAcceptedPostCount: Int
    getAcceptedPostCountByEmail(email: String!): Int
    
    """
    Gets all posts in database
    """
	getAllPost: [Post]

    """
    Returns a page of posts.
    """
    getPostPage(postPerPage: Int!, page: Int!, coordinates: [Float]): [Post]

    """
    Returns the total post count
    """
    getPostCount: Int

    """
    Searches for a page of post satifing the query text or sort posts by shortest distance mutual exclusivly
    """
    searchPostPage(queryText: String!, postPerPage: Int!, page: Int!, coordinates: [Float], sortByDist: Boolean): [Post]

    """
    Return total counts for a page of post satifing the query text or sort posts by shortest distance mutual exclusivly
    """
    searchPostPageCount(queryText: String!, sortByDist: Boolean): Int
`;


/**
 * Note: Graphql operations handle thrown errors automatically.Graphql Shield has taken care
 *       of authorization and sanitization
 * Comments on object:
 * 
 * @param addPost Adds a post to the data base and return the resulting document
 * @param acquirePost Acquires the post with _id if not yet acquired
 * @param unacquirePost Unacquries the post with _id if acquired by the user
 * @param setPost Updates the post object with _id on database and return the new document
 * @param deletePost Removes the post object with _id.
 * 
 */
const postMut = {
    async addPost (_, { title, content, coordinates, type}, context) {
        title = stripXss(title);
        content = stripXss(content);
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
                throw new Error("Post addition failed");
            });
    },
    async acquirePost(_, {_id}, context){
        
        const res = await Post.updateOne({ _id },
                                         {acceptorEmail: context.getUser().email,
                                          acceptorUsername: context.getUser().username,
                                          state: 1});
        return res.acknowledged;
    },
    async unacquirePost(_, {_id}){

        const res = await Post.updateOne({ _id},
                                         {acceptorEmail: "",
                                          acceptorUsername: "",
                                          state: 0});
        return res.acknowledged;
    },
    async setPost(_, { _id, title, content }){
        title = stripXss(title);
        content = stripXss(content);
        const post = await Post.findOne({_id});
        if (post == null)
            throw new Error("Post does not exist");
        const res = await Post.updateOne({ _id },
                                         { title: title == null ? post.title : title,
                                           content: content == null ? post.content : content,});
        if (!res.acknowledged)
            throw new Error("Update Failed");
        const updatedPost = await Post.findOne({_id});
        if (!updatedPost)
            throw new Error("Post does not exist anymore")
        return updatedPost;
    },
    async deletePost(_, {_id}){
        
        return Post.deleteOne({_id: _id}).then(result => {
                return  result.deletedCount;
            })
            .catch (err => {
                throw new Error("Post deletion failed");
            });
    },
};

/**
 * Note: Graphql operations handle thrown errors automatically. Graphql Shield has taken care
 *       of authorization and sanitization
 * Comments on object:
 * 
 * @param getOnePost Gets the post with _id and add its distances if provided coordinates
 * @param getUserPostsPage Gets a page of post posted by the current user. Add coordinates if provided
 * @param getUserPostsPageByEmail Gets a page of post posted by the email user. Add coordinates if provided
 * @param getAcceptedPostsPage Like getUserPostsPage but only accepted posts
 * @param getUserPostsPageByEmail Like getUserPostsPageByEmail but only accepted posts
 * @param getUserPostCount Total number of documents posted by current user
 * @param getUserPostCountByEmail Total number of documents posted by email user
 * @param getAcceptedPostCount Like getUserPostCount but for accepted posts
 * @param getAcceptedPostCountByEmail Like getUserPostCountByemail but for accepted posts
 * @param getAllPost Get all posts from database
 * @param getPostPage Get a page of posts indiscriminantly
 * @param getPostCount Total number of pages in database
 * @param searchPostPage Search for a page of posts specified by queryText or sort by shortest distance mutual
 *                       exclusively. Adds coordinates if provided.
 * @param searchPostPageCount Total count for posts spec  specified by queryText or sort by shortest distance mutual
 *                            exclusively.
 */
const postQuery = {
    async getOnePost(_, {_id, coordinates}){
        const post = await Post.findOne({_id});
        if (post == null)
            throw new Error('Post does not exist');
        post["distance"] = null;
        if (coordinateCheck(coordinates)){
                post["distance"] = getDistance(coordinates, post.location.coordinates) / 1000;
            }
        return post;
    },
    async getUserPostsPage(_, { userPostPerPage, page, coordinates }, context){
        if (page < 0)
            throw new Error("page number undefined");
        if (userPostPerPage == 0)
            return [];
        const posts = await Post.find({posterEmail: context.getUser().email}).sort({ 'createdAt': -1 }).skip(page * userPostPerPage).limit(userPostPerPage);
        return addDistances (posts, coordinates);
    },
    async getUserPostsPageByEmail(_, { email, userPostPerPage, page, coordinates }){
        if (page < 0)
            throw new Error("page number undefined");
        if (userPostPerPage == 0)
            return [];
        const posts = await Post.find({posterEmail: email}).sort({ 'createdAt': -1 }).skip(page * userPostPerPage).limit(userPostPerPage);
        return addDistances (posts, coordinates);
    },
    async getAcceptedPostsPage(_, { acceptedPostPerPage, page, coordinates }, context){
        if (page < 0)
            throw new Error("page number undefined");
        if (acceptedPostPerPage == 0)
            return [];
        const posts = await Post.find({acceptorEmail: context.getUser().email}).sort({ 'createdAt': -1 }).skip(page * acceptedPostPerPage).limit(acceptedPostPerPage);
        return addDistances (posts, coordinates);
    },
    async getAcceptedPostsPageByEmail(_, { email, acceptedPostPerPage, page, coordinates }){
        if (page < 0)
            throw new Error("page number undefined");
        if (acceptedPostPerPage == 0)
            return [];
        const posts =  await Post.find({acceptorEmail: email}).sort({ 'createdAt': -1 }).skip(page * acceptedPostPerPage).limit(acceptedPostPerPage);
        return addDistances (posts, coordinates);
    },
    async getUserPostCount(_, __, context){
        return await Post.countDocuments({posterEmail: context.getUser().email});
    },
    async getUserPostCountByEmail(_, {email}){
        return await Post.countDocuments({posterEmail: email});
    },
    async getAcceptedPostCount(_, __, context){
        return await Post.countDocuments({acceptorEmail: context.getUser().email});
    },
    async getAcceptedPostCountByEmail(_, {email}){
        return await Post.countDocuments({acceptorEmail: email});
    },
    
    async getPostPage(_, { postPerPage, page, coordinates }){
        if (page < 0)
            throw new Error("page number undefined");
        if (postPerPage == 0)
            return [];
        const posts = await Post.find({}).sort({ 'createdAt': 1 }).skip(page * postPerPage).limit(postPerPage);
        return addDistances (posts, coordinates);
    },
    async getPostCount(){
        return await Post.countDocuments();
    },
	async getAllPost(){
        const posts = await Post.find({});
        if (posts == null)
            throw new UserInputError("post does not exist");
        return posts;
    },

    async searchPostPage(_, { queryText, postPerPage, page, coordinates, sortByDist }){
        if (page < 0)
            throw new Error("page number undefined");
        if (postPerPage == 0)
            return [];
        if (sortByDist && coordinateCheck(coordinates)){
            const posts = await Post.find({
                location:
                    { $near:
                        {
                        $geometry: { type: "Point",  coordinates: [ coordinates[0], coordinates[1] ] },
                        }
                    }
                }).skip(page * postPerPage).limit(postPerPage);
            return addDistances(posts, coordinates);
        }
        else {
            if (queryText == ""){
                    const posts = await Post.find({}).sort({ 'createdAt': -1 }).skip(page * postPerPage).limit(postPerPage)
                    return addDistances(posts, coordinates);
            }
            else {
                    const posts = await Post.find({ $text: {$search: queryText } }).sort({ score: {$meta: "textScore" } }).skip(page * postPerPage).limit(postPerPage);
                    return addDistances(posts, coordinates);
            }
            
        }
        
        
    },
    async searchPostPageCount(_, {queryText, sortByDist}){
        if (!sortByDist && queryText != "")
            return await Post.countDocuments({ $text: {$search: queryText }});
        else
            return await Post.countDocuments({});
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

