const mongoose = require('mongoose');

const trackerSchema = mongoose.Schema(
    {
        tracker: {
            type: String,
            required: true,
            index: true
        },
        addresses: {
            type: Array,
            required: true
        },
        minimum: {
            type: Number,
            required: true
        },
        schedule: {
            type: String,
            required: true
        },
    },
    {
        timestamps: true,
    }
);

const Tracker = mongoose.model('Tracker', trackerSchema);
module.exports = Tracker;