const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskListSchema = new schema({
    title: { type: String, require },
    creationDate: {
        type: Date,
        default: Date.now,
        require
    },
    resolutionDate: {
        type: Date,
        require
    },
    state: {
        type: Boolean,
        default: false,
        require
    },
    tasks:{type: Schema.ObjectId, ref: 'tasks'}

});

module.exports = mongoose.model('listTasks',TaskListSchema);