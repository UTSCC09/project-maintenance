/*jshint esversion: 9 */

/**
 * 
 * Reference in general
 * Mongoose Docs: https://mongoosejs.com/docs/guide.html
 * Apollo Docs: https://www.apollographql.com/docs/apollo-server/
 *  
 */

const { Message, Post, User, Comment } = require('./mongooseSchemas');
const { addDistances, getDistance, coordinateCheck } = require('./algorithms/distance');
const { passwordValidate, stripXss, textFieldLenCheck, emailValidate, unmodifiableValidate, phoneValidate } = require('./schemaRules/sanitizationRules');
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
    """
    Deletes the user defined in email, curretly not available for use.
    """
    deleteUser(email: String): Del

    """
    Changes user information based on input and returns the newly created user
    """
    setUser(username: String!, phone: String!): User

    """
    Changes the current user to worker if it is not one already. Returns the newly
    created user.
    """
    setWorker(coordinates: [Float!]): User
`;

const userQueryDef = `
    """
    Returns a user instance based on email
    """
    getOneUser(email: String!): User

    """
    Returns a worker instance based on email
    """
    getOneWorker(email: String!, coordinates: [Float]): User

    """
    Returns the total worker count
    """
    getWorkerCount: Int

    """
    Returns a page of worker based on input
    """
    getWorkerPage(workerPerPage: Int!, page: Int!, coordinates: [Float]): [User]

    """
    Searches a page of worker. Currently supports querytexts and distance sort mutually exclusive.
    """
    searchWorkerPage(queryText: String!, workerPerPage: Int!, page: Int!, coordinates: [Float], sortByDist: Boolean): [User]

    """
    Returns the total count of the query result. Currently supports querytexts and distance sort mutually exclusive.
    """
    searchWorkerPageCount(queryText: String!, sortByDist: Boolean): Int
`;

/**
 * Note: Graphql operations handle thrown errors automatically.
 * Comments on object:
 * 
 * @param getWorkerPage Returns a page of workers sorted by newest. The comment counts of each worker is also added 
 *                      for display purposes. If a pair of coordinates are provided, add the distances on the workers.
 * @param getWorkerCount Returns the total number of workers
 * @param getOneWorker Returns one worker specified by email. Comments and distances follow getWorkerPage
 * @param getOneUser Returns one user specified by email.
 * @param searchWorkerPage Searches for a page of workers based on queryText or by shortest distance mutual exclusivly.
 *                         Comments and distances follow getWorkerPage.
 * @param searchWorkerPageCount Return total worker counts based on querytext. 
 * 
 */
const userQuery = {
    async getWorkerPage(_, { workerPerPage, page, coordinates }){
        if (page < 0)
            throw new Error("page number undefined");
        if (workerPerPage == 0)
            return [];

        const workers = await User.find({ type: "worker" }).sort({ 'createdAt': -1 }).skip(page * workerPerPage).limit(workerPerPage);
        return addCommentCount(addDistances (workers, coordinates));
    },
    async getWorkerCount(){
        return await User.countDocuments({ type: "worker" });
    },
    async getOneWorker(_, {email, coordinates}){
        const worker = await User.findOne({$and : [
            {email},
            {type: "worker"}   
        ]});
        if (worker == null)
            throw new Error('worker does not exist');

        worker["distance"] = null;
        if (coordinateCheck(coordinates))
            worker["distance"] = getDistance(coordinates, worker.location.coordinates) / 1000;

        const newWorker = await addCommentCount([worker]);
        return newWorker[0];
    },
    async getOneUser(_, {email}){
        const user = await User.findOne({email});
        if (user == null)
            throw new Error('worker does not exist');
        return user;
    },
    async searchWorkerPage(_, { queryText, workerPerPage, page, coordinates, sortByDist }){
        if (page < 0)
            throw new Error("page number undefined");
        if (workerPerPage == 0)
            return [];
            
        if (sortByDist && coordinateCheck(coordinates)) {
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

        if (queryText == ""){
            const workers = await User.find({ type: "worker" }).sort({ 'createdAt': -1 }).skip(page * workerPerPage).limit(workerPerPage);
            return addCommentCount(addDistances(workers, coordinates));
        }
        else {
            const workers = await User.find({$and: [{ $text: {$search: queryText } }, 
                                                    { type: "worker" }]}).sort({ score: {$meta: "textScore" } }).skip(page * workerPerPage).limit(workerPerPage);
            return addCommentCount(addDistances(workers, coordinates));
        }
        
    },
    async searchWorkerPageCount(_, {queryText, sortByDist}){
        if (!sortByDist && queryText != "")
            return await User.countDocuments({$and: [{ $text: {$search: queryText } }, 
                                             { type: "worker" }]});
        else
            return await User.countDocuments({ type: "worker" });
    }

};

/**
 * Note: Graphql operations handle thrown errors automatically.
 * Comments on object:
 * 
 * @param deleteUser currently unavailable
 * @param setUser updates the user's information and modify the related documents
 * @param setWorker Sets the user to be a worker at the input location.
 */
const userMut = {
    async deleteUser (_, { email }){
        return User.deleteOne({email}).then (result => {
                                    return { count: result.deletedCount };
                                })
                                .catch (err => {
                                    console.error(err);
                                });
    },
    async setUser (_, { username, phone }, context){
        if (!phoneValidate(phone))
            throw new Error("Phone number invalid");
        if (username.length <= 0 || !textFieldLenCheck(username, 20) || !unmodifiableValidate(username) || stripXss(username) != username)
            throw new Error("Username should contain alphanumerics and be less than or equal to 20 letters");

        let res = await User.updateOne({ email: context.getUser().email },
                                         { phone, username});
        if (!res.acknowledged)
            throw new Error("update User failed");
        res = await Message.updateMany({email: context.getUser().email}, 
                                       {username});
        if (!res.acknowledged)
            throw new Error("update User messages failed");

        res = await Post.updateMany({posterEmail: context.getUser().email}, 
                                    {posterUsername: username});
        if (!res.acknowledged)
            throw new Error("update User Posts failed");

        res = await Post.updateMany({acceptorEmail: context.getUser().email}, 
                                    {acceptorUsername: username});
        if (!res.acknowledged)
            throw new Error("update User Posts failed");

        let updatedUser = await User.findOne({ email: context.getUser().email });
        if (!res.acknowledged)
            throw new Error("User disappeared, should not happen");
        return updatedUser;
    },
    async setWorker (_, { coordinates }, context){
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

