/*jshint esversion: 9 */
const { Comment, Appointment, User } = require('./mongooseSchemas');
const { rule } = require('graphql-shield');

const commentDefs = `
    type Comment {
        _id: String
        content: String
        appointmentId: String 
        workerEmail: String
        userEmail: String
        rating: Int
        isCommented: Boolean
        createdAt: String
        updatedAt: String
    }
`;

const commentMutDef = `
    addComment(appointmentId: String!, workerEmail: String!, rating: Int!, content: String!): Comment
    deleteComment(_id: String!): Boolean
    editComment(_id: String!, rating: Int, content: String): Comment
`;

const commentQueryDef = `
    getCommentOnWorkerPage(email: String!, commentPerPage: Int!, page: Int!,): [Comment]
    getCommentOnWorkerCount(email: String!): Int

    getCommentByUserPage(email: String!, commentPerPage: Int!, page: Int!,): [Comment]
    getCommentByUserCount(email: String!): Int
`;

const commentMut = {
    async addComment(parent, {appointmentId, workerEmail, rating, content}, context, info){
        const commentObj = new Comment({
            appointmentId,
            workerEmail,
            userEmail: context.getUser().email,
            rating,
            content
        });
        const result = await commentObj.save()
                
        const commentCount = await commentQuery.getCommentOnWorkerCount(null, {email: workerEmail}, null, null);
        if (commentCount == 0)
            await User.updateOne({email: workerEmail}, {rating: 5});
        else if (commentCount == null || commentCount < 0)
            return new Error("Error updating rating");
        else{
            const allComments = await commentQuery.getCommentOnWorkerPage(null, {email: workerEmail, commentPerPage: commentCount, page: 0}, null, null)
            let ratingSum = 0;
            allComments.forEach((elem) => {
                ratingSum += elem.rating;
            });
            await User.updateOne({email: workerEmail}, {rating: ratingSum / commentCount});
        }

        return { ...result._doc };
    },
    async deleteComment(parent, {_id}, context, info){
        return  Comment.deleteOne({ _id }).then(result => {
            return  result.deletedCount;
        })
        .catch (err => {
            throw new Error("Comment deletion failed");
        });
    },
    async editComment(parent, {_id, rating, content}, context, info){
        const comment = await Comment.findOne({ _id });
        const res = await Comment.updateOne({ _id },
                                         { rating: rating == null ? comment.rating : rating,
                                            content: content == null ? comment.content : content});
        if (!res.acknowledged)
            return new Error("Update Failed");
        const updatedComment = await Comment.findOne({ _id });
        if (!updatedComment)
            return new Error("Comment does not exist anymore")
        return updatedComment;
    }
};

const commentQuery = {
    async getCommentOnWorkerPage(parent, {email, commentPerPage, page}, context, info){
        if (page < 0)
            throw new Error("page number undefined");
        if (commentPerPage == 0)
            return [];
        const comments = await Comment.find({workerEmail: email}).sort({ 'updatedAt': -1 }).skip(page * commentPerPage).limit(commentPerPage);
        return comments;
    },

    async getCommentByUserPage(parent, {email, commentPerPage, page}, context, info){
        if (page < 0)
            throw new Error("page number undefined");
        if (commentPerPage == 0)
            return [];
        const comments = await Comment.find({userEmail: email}).sort({ 'updatedAt': -1 }).skip(page * commentPerPage).limit(commentPerPage);
        return comments;
    },

    async getCommentOnWorkerCount(parent, {email}, context, info){
        return await Comment.countDocuments({workerEmail: email});
    },
    async getCommentByUserCount(parent, {email}, context, info){
        return await Comment.countDocuments({userEmail: email});
    },

};

const commentRules = {
    addCommmentRule: rule()( async (parent, {appointmentId, workerEmail, rating, content}, context) => {

        const curDate = new Date();
        const appointment = await Appointment.findOne({$and: [
            {_id: appointmentId},
            { endTime: { $lte: curDate.getTime() }}
        ]});
        
        if (appointment == null)
            return new Error("No such appointment or appointment not finished");

        const worker = await User.findOne({$and: [
            {email: workerEmail},
            {type: "worker"}
        ]});
        if (worker == null || appointment.workerEmail != workerEmail || appointment.userEmail != context.getUser().email)
            return new Error("No such worker or wrong appointment");
        else if (worker.email == context.getUser().email)
            return new Error("Cannot comment yourself")

        const duplicate = await Comment.findOne({ $and : [
            {workerEmail},
            {appointmentId},
            {userEmail: context.getUser().email}
        ]});

        if (duplicate != null)
            return new Error("Duplicate comment");

        if (rating != null && (rating > 5 || rating < 0))
            return new Error("Rating out of bounds");
        return true;
    }),

    isOwnCommenter: rule()( async (parent, {_id}, context) => {
        
        const comment = await Comment.findOne({ _id });
        if (comment == null || comment.userEmail != context.getUser().email)
            return new Error('Comment no longer exist or not authorized');
        return true;
    }),
};

module.exports = {
    Comment,
    commentDefs,
    commentMutDef,
    commentQueryDef,
    commentMut,
    commentQuery,
    commentRules,
};