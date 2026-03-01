const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    room: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);