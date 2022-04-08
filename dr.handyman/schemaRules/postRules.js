/*jshint esversion: 9 */

/**
 * 
 * Reference In General:
 * Graphql Shield: https://www.graphql-shield.com/docs
 * 
 */
const { rule } = require('graphql-shield');
const { Post } = require('../mongooseSchemas');
const { textFieldLenCheck } = require('./sanitizationRules');

/**
 * Comment on Object
 * 
 * @param addPostRules 1. Validate title, who should have at least one character and maximum 20 letters
 *                     2. Validate content, who should have at least one character and maximum 500 letters
 *                     3. Validate type who should be either 0 or 1
 *                     4. Validate coordinate who should be an array of geolocations [long, lat]
 * @param setPostRules Validates the title and the content\
 * @param notAcquired Errors if post already acquired
 * @param isAcquiree Errors if post have not been acquired by the current user
 * @param isOwner Errors if current user is not the owner of the post.
 */
const postRules = {
    addPostRules: rule()( async (_, {title, content, coordinates, type}) => {
        if (title.length <= 0 || !textFieldLenCheck(title, 20))
            return new Error("Title should have at least one character and maximum 20 letters");
        if (content.length <= 0 || !textFieldLenCheck(title, 500))
            return new Error("Content should have at least one character and maximum 500 letters");
        if (type > 1 || type < 0)
            return new Error("Type does not eixts");

        if (coordinates == null)
            return new Error("No coordinate");
        else if (coordinates != undefined && coordinates.length == 2 && 
            typeof coordinates[0] === "number" && typeof coordinates[1] === "number" && 
            coordinates[0] <= 180 && coordinates[0] >= -180 && 
            coordinates[0] <= 90 && coordinates[0] >= -90)
            return true;
        else
            return new Error("Coordinate invalid");
    }),
    setPostRules: rule()( async (_, { title, content }) => {
        if (title.length <= 0 || !textFieldLenCheck(title, 20))
            return new Error("Title should have at least one character and maximum 20 letters");
        if (content.length <= 0 || !textFieldLenCheck(title, 500))
            return new Error("Content should have at least one character and maximum 500 letters");
        return true;

    }),
    notAcquired: rule()( async (_, {_id}, context) => {
        const post = await Post.findOne({_id});
        if (post == null || post.acceptorEmail != "" || post.posterEmail == context.getUser().email)
            throw new Error("Cannot acquire post");
        return true;
    }),
    isAcquiree: rule()( async (_, {_id}, context) => {
        const post = await Post.findOne({_id});
        if (post == null || post.acceptorEmail != context.getUser().email)
            throw new Error("Cannot unacquire post");
        return true;
    }),
    isOwner: rule()( async (_, {_id}, context) => {
        const post = await Post.findOne({_id});
        if (post == null || post.posterEmail != context.getUser().email)
            throw new Error('Post no longer exist or not authorized');
        return true;
    }),
};

module.exports = {
    postRules,
};