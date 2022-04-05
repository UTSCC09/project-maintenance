/*jshint esversion: 9 */
const { rule } = require('graphql-shield');
const { Post } = require('../mongooseSchemas');

const postRules = {
    addPostRules: rule()( async (parent, {coordinates, type}, context) => {
        if (type > 1 || type < 0)
            return new Error("Type does not eixts");

        if (coordinates == null)
            return new Error("No coordinate");
        else if (coordinates != undefined && coordinates.length == 2
            && typeof coordinates[0] === "number" && typeof coordinates[1] === "number"
            && coordinates[0] <= 180 && coordinates[0] >= -180
            && coordinates[0] <= 90 && coordinates[0] >= -90)
            return true;
        else
            return new Error("Coordinate invalid");
    }),
    notAcquired: rule()( async (parent, args, context) => {
        const post = await Post.findOne({_id: args._id});
        if (post == null || post.acceptorEmail != "" || post.posterEmail == context.getUser().email)
            throw new Error("Cannot acquire post");
        return true;
    }),
    isAcquiree: rule()( async (parent, args, context) => {
        const post = await Post.findOne({_id: args._id});
        if (post == null || post.acceptorEmail != context.getUser().email)
            throw new Error("Cannot unacquire post");
        return true;
    }),
    isOwner: rule()( async (parent, args, context) => {
        const post = await Post.findOne({_id: args._id});
        if (post == null || post.posterEmail != context.getUser().email)
            throw new Error('Post no longer exist or not authorized');
        return true;
    }),
}

module.exports = {
    postRules,
};