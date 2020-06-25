const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskListSchema = new Schema({
    title: { type: String, require },
    creationDate: {
        type: Date,
        default: new Date(new Date() - 3600 * 1000 * 3).toISOString(),
        require
    },
    resolutionDate: {
        type: String,
        default: '-',
        require
    },
    state: {
        type: Boolean,
        default: false,
        require
    },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('listTasks', TaskListSchema);