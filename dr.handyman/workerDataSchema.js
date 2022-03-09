const mongoose  = require('mongoose');
const { Schema } = mongoose;
const workerDataDefs = `
    type WorkerData {
    title: String
    author: String
  }`
const workerDataMutDef = `
addWorker(title: String, author: String): WorkerData
    `

const WorkerDataSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
})

const WorkerData = mongoose.model('WorkerData', WorkerDataSchema);

const workerDataMut = {
    addWorker (parent, args, context, info) {
        const { title, author } = args
        const workerObj = new WorkerData({
            title, author
        });
        return workerObj.save()
            .then (result => {
                return { ...result._doc }
            })
            .catch (err => {
                console.error(err)
            })
    },
}

module.exports = {
    workerDataDefs,
    workerDataMutDef,
    WorkerData,
    workerDataMut,
}

