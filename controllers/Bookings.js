const Booking = require('../models/Booking');
const CoworkingSpace = require('../models/CoworkingSpace');

// @desc    Get all bookings
// @route   GET /api/v1/bookings
// @route   GET /api/v1/coworkingspaces/:coworkingspaceId/bookings
// @access  Private
exports.getBookings = async (req, res, next) => {
    let query;

    // ถ้า User ธรรมดา ล็อกให้ดูได้แค่การจองของตัวเอง
    if (req.user.role !== 'admin') {
        query = Booking.find({ user: req.user.id }).populate({
            path: 'coworkingspace',
            select: 'name address tel open_close_time'
        });
    } else {
        // ถ้าเป็น Admin ดึงการจองทั้งหมดมาดูได้
        if (req.params.coworkingspaceId) {
            query = Booking.find({ coworkingspace: req.params.coworkingspaceId }).populate({
                path: 'coworkingspace',
                select: 'name address tel open_close_time'
            });
        } else {
            query = Booking.find().populate({
                path: 'coworkingspace',
                select: 'name address tel open_close_time'
            });
        }
    }

    try {
        const bookings = await query;
        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Cannot find Booking" });
    }
};

// @desc    Get single booking
// @route   GET /api/v1/bookings/:id
// @access  Private
exports.getBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id).populate({
            path: 'coworkingspace',
            select: 'name address tel open_close_time'
        });

        if (!booking) {
            return res.status(404).json({ success: false, message: `No booking with the id of ${req.params.id}` });
        }

        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Cannot find Booking" });
    }
};

// @desc    Add booking
// @route   POST /api/v1/coworkingspaces/:coworkingspaceId/bookings
// @access  Private
exports.addBooking = async (req, res, next) => {
    try {
        req.body.coworkingspace = req.params.coworkingspaceId;
        req.body.user = req.user.id;

        // เช็คว่าสถานที่ที่จองมีอยู่จริงไหม
        const coworkingspace = await CoworkingSpace.findById(req.params.coworkingspaceId);
        if (!coworkingspace) {
            return res.status(404).json({ success: false, message: `No coworking space with the id of ${req.params.coworkingspaceId}` });
        }

        // ดึงข้อมูลการจองเก่ามานับจำนวน
        const existedBookings = await Booking.find({ user: req.user.id });

        // เงื่อนไข: User ทั่วไปจองได้สูงสุด 3 ห้อง
        if (existedBookings.length >= 3 && req.user.role !== 'admin') {
            return res.status(400).json({ success: false, message: `The user with ID ${req.user.id} has already made 3 bookings` });
        }

        const booking = await Booking.create(req.body);
        res.status(200).json({ success: true, data: booking });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Cannot create Booking" });
    }
};

// @desc    Update booking
// @route   PUT /api/v1/bookings/:id
// @access  Private
exports.updateBooking = async (req, res, next) => {
    try {
        let booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, message: `No booking with the id of ${req.params.id}` });
        }

        // ตรวจสอบสิทธิ์ว่าใช่เจ้าของการจอง หรือเป็น Admin ไหม
        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: `User ${req.user.id} is not authorized to update this booking` });
        }

        booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Cannot update Booking" });
    }
};

// @desc    Delete booking
// @route   DELETE /api/v1/bookings/:id
// @access  Private
exports.deleteBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, message: `No booking with the id of ${req.params.id}` });
        }

        // ตรวจสอบสิทธิ์ว่าใช่เจ้าของการจอง หรือเป็น Admin ไหม
        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: `User ${req.user.id} is not authorized to delete this booking` });
        }

        await booking.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Cannot delete Booking" });
    }
};