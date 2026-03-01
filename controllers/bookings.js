const Booking = require('../models/Booking');

// @desc    Get all bookings
// @route   GET /api/v1/bookings
exports.getBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find();

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Cannot get bookings"
        });
    }
};


// @desc    Get single booking
// @route   GET /api/v1/bookings/:id
exports.getBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        res.status(200).json({
            success: true,
            data: booking
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Cannot get booking"
        });
    }
};


// @desc    Create booking (3 string demo)
/// @route   POST /api/v1/bookings
exports.createBooking = async (req, res, next) => {
    try {
        const { name, date, room } = req.body;

        const booking = await Booking.create({
            name,
            date,
            room
        });

        res.status(201).json({
            success: true,
            data: booking
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Cannot create booking"
        });
    }
};


// @desc    Update booking
// @route   PUT /api/v1/bookings/:id
exports.updateBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        res.status(200).json({
            success: true,
            data: booking
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Cannot update booking"
        });
    }
};


// @desc    Delete booking
// @route   DELETE /api/v1/bookings/:id
exports.deleteBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        res.status(200).json({
            success: true,
            data: {}
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Cannot delete booking"
        });
    }
};