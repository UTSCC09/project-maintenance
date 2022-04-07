/*jshint esversion: 9 */

const { Message, Post, User, Comment } = require('./mongooseSchemas');
const { addDistances, getDistance } = require('./algorithms/distance');

/**
 * Add comment counts to the list of worker objects.
 * @param {Array} inputList list of workers.
 * @returns newly mapped inputList with each their comment count.
 */
async function addCommentCount (inputList)
{
    await Promise.all(inputList.map(async (worker) => {
        try {
            const count = await Comment.countDocuments({workerEmail: worker.email})
            worker.commentCount = count;
            return worker;
        } catch (error) {
            throw new Error("Comment count append failed");
        }
    }));
    return inputList;
}

const userDefs = `
    input UserInput {
        type: String
        phone: Int
        rating: Float
    }
    
    """
    User object conntaining basic user information.
    """
    type User {
        email: String
        username: String
        password: String
        type: String
        phone: String
        rating: Float
        location: [Float!]
        distance: Float
        commentCount: Int
        profilePic: File
        createdAt: String
    }
    type Del {
        count: Int
}
`;

const userMutDef = `
    deleteUser(email: String): Del
    setUser(username: String!, phone: String!): User
    setWorker(coordinates: [Float!]): User
`;

const userQueryDef = `
    getOneUser(email: String!): User
    getOneWorker(email: String!, coordinates: [Float]): User
    getWorkerCount: Int
    getWorkerPage(workerPerPage: Int!, page: Int!, coordinates: [Float]): [User]

    searchWorkerPage(queryText: String!, workerPerPage: Int!, page: Int!, coordinates: [Float], sortByDist: Boolean): [User]
    searchWorkerPageCount(queryText: String!, sortByDist: Boolean): Int
`;

const userQuery = {
    async getWorkerPage(parent, args, context, info){
        const { workerPerPage, page, coordinates } = args;
        if (page < 0)
            throw new Error("page number undefined");
        if (workerPerPage == 0)
            return [];

        const workers =  await User.find({ type: "worker" }).sort({ 'createdAt': -1 }).skip(page * workerPerPage).limit(workerPerPage);
        return addCommentCount(addDistances (workers, coordinates));
    },
    async getWorkerCount(parent, args, context, info){
        return await User.countDocuments({ type: "worker" });
    },
    async getOneWorker(parent, args, context, info){
        const worker = await User.findOne({$and : [
            {email: args.email},
            {type: "worker"}   
        ]});
        if (worker == null)
            throw new Error('worker does not exist');
        worker["distance"] = null;
        if (args.coordinates != null && args.coordinates != undefined && args.coordinates.length == 2
            && typeof args.coordinates[0] === "number" && typeof args.coordinates[1] === "number"){
                worker["distance"] = getDistance(args.coordinates, worker.location.coordinates) / 1000;
            }
        const newWorker = await addCommentCount([worker]);
        return newWorker[0];
    },
    async getOneUser(parent, args, context, info){
        const user = await User.findOne({email: args.email});
        if (user == null)
            throw new Error('worker does not exist');
        return user;
    },
    async searchWorkerPage(parent, args, content, info){
        const { queryText, workerPerPage, page, coordinates, sortByDist } = args;
        if (page < 0)
            throw new Error("page number undefined");
        if (workerPerPage == 0)
            return [];
        if (sortByDist && coordinates != null && coordinates != undefined && coordinates.length == 2
            && typeof coordinates[0] === "number" && typeof coordinates[1] === "number")
            {
                const workers = await User.find({$and: [{
                    location:
                      { $near:
                         {
                           $geometry: { type: "Point",  coordinates: [ coordinates[0], coordinates[1] ] },
                         }
                      }
                  }, { type: "worker" }]}).skip(page * workerPerPage).limit(workerPerPage);
                return addDistances(workers, coordinates);
            }
        if (queryText == "")
            {
                const workers = await User.find({ type: "worker" }).sort({ 'createdAt': -1 }).skip(page * workerPerPage).limit(workerPerPage);
                return addCommentCount(addDistances(workers, coordinates));
            }
        else {
            const workers = await User.find({$and: [{ $text: {$search: queryText } }, 
                { type: "worker" }]}).sort({ score: {$meta: "textScore" } }).skip(page * workerPerPage).limit(workerPerPage);
            return addCommentCount(addDistances(workers, coordinates));
        }
        
    },
    async searchWorkerPageCount(parent, args, content, info){
        if (!args.sortByDist && args.queryText != "")
            {
                return await User.countDocuments({$and: [{ $text: {$search: args.queryText } }, 
                    { type: "worker" }]});
            }
        else
            {
                return await User.countDocuments({ type: "worker" });
            }
        
    }

};

const userMut = {
    async deleteUser (parent, args, context, info){
        const { email } = args;
        return User.deleteOne({email: email}).then (result => {
                                    return { count: result.deletedCount };
                                })
                                .catch (err => {
                                    console.error(err);
                                });
    },
    async setUser (parent, args, context, info){
        const { username, phone } = args;
        let res = await User.updateOne({ email: context.getUser().email },
                                         { phone, username});
        if (!res.acknowledged)
            throw new Error("update failed");
        res = await Message.updateMany({email: context.getUser().email}, 
                                       {username});
        if (!res.acknowledged)
            throw new Error("update failed");

        res = await Post.updateMany({posterEmail: context.getUser().email}, 
                                    {posterUsername: username});
        if (!res.acknowledged)
            throw new Error("update failed");

        res = await Post.updateMany({acceptorEmail: context.getUser().email}, 
                                    {acceptorUsername: username});
        if (!res.acknowledged)
            throw new Error("update failed");
        let updatedUser = await User.findOne({ email: context.getUser().email });
        if (!res.acknowledged)
            throw new Error("User disappeared, should not happen");
        return updatedUser;
    },
    async setWorker (parent, args, context, info){
        const { coordinates } = args;
        const res = await User.updateOne({ email: context.getUser().email },
                                         { $set:
                                            {
                                                type: "worker",
                                                location: {coordinates, type: 'Point'}
                                            }
                                         });
        if (!res.acknowledged)
            throw new Error("set failed");
        let updatedUser = await User.findOne({ email: context.getUser().email });
        if (!res.acknowledged)
            throw new Error("User disappeared, should not happen");
        return updatedUser;
    }
};

module.exports = {
    userDefs,
    userQueryDef,
    userMutDef,
    User,
    userMut,
    userQuery
};

