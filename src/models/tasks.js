const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    title: {
        type: String, validate: /\S+/, required: [true, 'title cannot be blank'],

    },
    creationDate: {
        type: Date,
        default: new Date(new Date() - 3600 * 1000 * 3).toISOString(),
        require
    },
    resolutionDate: {
        type: String,
        require
    },
    description: {
        type: String,
        require,
        validate: /\S+/
    },
    preority: {
        type: String,
        default: '0',
        enum: ['0', '1', '2'],
        require
    },
    deafline: {
        type: String,
        default: ""

    },
    state: {
        type: Boolean,
        default: false,
        require
    },
    img: {
        filename: { type: String },
        path: { type: String },
        originalname: { type: String },
        mimetype: { type: String }
    },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    list: { type: Schema.Types.ObjectId, default: null, ref: 'listTasks' }

});

module.exports = mongoose.model('tasks', TaskSchema)
