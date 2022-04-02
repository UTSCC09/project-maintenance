/*jshint esversion: 8 */

const { Message, Post, User, Comment } = require('./mongooseSchemas');

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

function addDistances (inputList, coordinates)
{
    if (coordinates != null && coordinates != undefined && coordinates.length == 2
        && typeof coordinates[0] === "number" && typeof coordinates[1] === "number"){
            inputList.forEach((elem) => {
                elem["distance"] = getDistance(coordinates, elem.location.coordinates) / 1000;
            })
            
        }
    else{
        inputList.forEach((elem) => {
            elem["distance"] = null;
        })
    }
    return inputList;
}

async function addCommentCount (inputList)
{
    // let newComments = []
    await Promise.all(inputList.map(async (worker) => {
    try {
        const count = await Comment.countDocuments({workerEmail: worker.email})
        worker.commentCount = count;
        return worker;
    } catch (error) {
        console.log('error'+ error);
    }
    }))
    return inputList // return without waiting for process of 
}

const userDefs = `
input UserInput {
    type: String
    phone: Int
    rating: Float
    permissions: [String]
}
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
    permissions: [String]
    createdAt: String
}
type Del {
    count: Int
}`;

const userMutDef = `
    deleteUser(email: String): Del
    setUser(username: String!, phone: String!): Boolean
    setWorker(coordinates: [Float!]): Boolean
`;

const userQueryDef = `
    getOneUser(email: String!): User
    getOneWorker(email: String!, coordinates: [Float]): User
    getWorkerCount: Int
    getWorkerPage(workerPerPage: Int!, page: Int!, coordinates: [Float]): [User]

    searchWorkerPage(queryText: String!, workerPerPage: Int!, page: Int!, coordinates: [Float]): [User]
    searchWorkerPageCount(queryText: String!): Int
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
        const { queryText, workerPerPage, page, coordinates } = args;
        if (page < 0)
            throw new Error("page number undefined");
        if (workerPerPage == 0)
            return [];
        const workers = await User.find({$and: [{ $text: {$search: queryText } }, 
                                       { type: "worker" }]}).sort({ score: {$meta: "textScore" } }).skip(page * workerPerPage).limit(workerPerPage);
        return addCommentCount(addDistances(workers, coordinates));
    },
    async searchWorkerPageCount(parent, args, content, info){
        return await User.countDocuments({$and: [{ $text: {$search: args.queryText } }, 
            { type: "worker" }]});
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
        return res.acknowledged;
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
        return res.acknowledged;
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

