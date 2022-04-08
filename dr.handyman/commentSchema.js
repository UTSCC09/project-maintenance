/*jshint esversion: 9 */

/**
 * 
 * Reference in general
 * Mongoose Docs: https://mongoosejs.com/docs/guide.html
 * Apollo Docs: https://www.apollographql.com/docs/apollo-server/
 *  
 */
const { Comment, User } = require('./mongooseSchemas');
const { stripXss } = require('./schemaRules/sanitizationRules');
const commentDefs = `
    """
    Comment object
    """
    type Comment {
        _id: String
        content: String
        appointmentId: String 
        workerEmail: String
        userEmail: String
        rating: Float
        createdAt: String
        updatedAt: String
    }
`;

const commentMutDef = `
    """
    Adds a comment to the appointmentId
    """
    addComment(appointmentId: String!, workerEmail: String!, rating: Float!, content: String!): Comment

    """
    Deletes a comment specified by comment id
    """
    deleteComment(_id: String!): Boolean

    """
    Update comment with new information
    """
    editComment(_id: String!, rating: Float, content: String): Comment
`;

const commentQueryDef = `
    """
    Gets a page of comments on the worker specified by email.
    """
    getCommentOnWorkerPage(email: String!, commentPerPage: Int!, page: Int!,): [Comment]

    """
    Gets the total count of comments on the worker specified by email.
    """
    getCommentOnWorkerCount(email: String!): Int

    """
    Gets a page of comments made by the user specified by email
    """
    getCommentByUserPage(email: String!, commentPerPage: Int!, page: Int!,): [Comment]

    """
    Gets the total count of comments made by the user specified by email
    """
    getCommentByUserCount(email: String!): Int
`;

async function recalculateRating (workerEmail){
    const commentCount = await commentQuery.getCommentOnWorkerCount(null, {email: workerEmail});
    if (commentCount == 0)
        await User.updateOne({email: workerEmail}, {rating: 5});
    else if (commentCount == null || commentCount < 0)
        throw new Error("Error updating rating");
    else{
        const allComments = await commentQuery.getCommentOnWorkerPage(null, {email: workerEmail, commentPerPage: commentCount, page: 0});
        let ratingSum = 0;
        allComments.forEach((elem) => {
            ratingSum += elem.rating;
        });
        await User.updateOne({email: workerEmail}, {rating: ratingSum / commentCount});
    }
    return;
}
/**
 * Note: Graphql operations handle thrown errors automatically. Graphql Shield has taken care
 *       of authorization and sanitization
 * Comments on object:
 * 
 * @param addComment Current user adds comment to worker defined by workerEmail. Each comment
 *                   need to be directed to an appointment. Comment contains rating and content.
 *                   Each new comment recalculates user rating.
 * @param deleteComment Deletes the comment specified by _id from appointment and recalculate the worker rating.
 * @param editComment Updates the comment specified by _id and recalculates the worker rating.
 * 
 */
const commentMut = {
    async addComment(_, {appointmentId, workerEmail, rating, content}, context){
        content = stripXss(content);
        const commentObj = new Comment({
            appointmentId,
            workerEmail,
            userEmail: context.getUser().email,
            rating,
            content
        });
        const result = await commentObj.save();
                
        await recalculateRating(workerEmail);

        return { ...result._doc };
    },
    async deleteComment(_, {_id},){
        const comment = await Comment.findOne({ _id });
        return  Comment.deleteOne({ _id }).then(async result => {
            await recalculateRating(comment.workerEmail);
            return  result.deletedCount;
        })
        .catch (err => {
            throw new Error("Comment deletion failed");
        });
    },
    async editComment(_, {_id, rating, content}){
        content = stripXss(content);
        const comment = await Comment.findOne({ _id });
        const res = await Comment.updateOne({ _id },
                                         { rating: rating == null ? comment.rating : rating,
                                            content: content == null ? comment.content : content});
        if (!res.acknowledged)
            throw new Error("Update Failed");
        const updatedComment = await Comment.findOne({ _id });
        if (!updatedComment)
            throw new Error("Comment does not exist anymore");
        await recalculateRating(updatedComment.workerEmail);
        return updatedComment;
    }
};

/**
 * Note: Graphql operations handle thrown errors automatically. Graphql Shield has taken care
 *       of authorization and sanitization
 * Comments on object:
 * 
 * @param getCommentOnWorkerPage Returns a page of comments on worker specified by email and 
 *                               sort them in earliest update time.
 * @param getCommentByUserPage Returns a page of comments by user specified by email and 
 *                             sort them in earliest update time.
 * @param getCommentOnWorkerCount Returns the total count of comment on worker specified by email
 * @param getCommentByUserCount Returns the total count of comment made by user specified by email.
 * 
 */
const commentQuery = {
    async getCommentOnWorkerPage(_, {email, commentPerPage, page}){
        if (page < 0)
            throw new Error("page number undefined");
        if (commentPerPage == 0)
            return [];
        const comments = await Comment.find({workerEmail: email}).sort({ 'updatedAt': -1 }).skip(page * commentPerPage).limit(commentPerPage);
        return comments;
    },

    async getCommentByUserPage(_, {email, commentPerPage, page}){
        if (page < 0)
            throw new Error("page number undefined");
        if (commentPerPage == 0)
            return [];
        const comments = await Comment.find({userEmail: email}).sort({ 'updatedAt': -1 }).skip(page * commentPerPage).limit(commentPerPage);
        return comments;
    },

    async getCommentOnWorkerCount(_, {email}){
        return await Comment.countDocuments({workerEmail: email});
    },
    async getCommentByUserCount(_, {email}){
        return await Comment.countDocuments({userEmail: email});
    },

};

module.exports = {
    Comment,
    commentDefs,
    commentMutDef,
    commentQueryDef,
    commentMut,
    commentQuery,
};