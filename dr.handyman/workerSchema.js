const mongoose  = require('mongoose');
const { Schema } = mongoose;
const workerDefs = `
    type Worker {
    title: String
    author: String
  }`
const workerMutDef = `
addWorker(title: String, author: String): Worker
    `

const WorkerSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
})

const Worker = mongoose.model('Worker', WorkerSchema);

const workerMut = {
    addWorker (parent, args, context, info) {
        const { title, author } = args
        const workerObj = new Worker({
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
    workerDefs,
    workerMutDef,
    Worker,
    workerMut,
}

