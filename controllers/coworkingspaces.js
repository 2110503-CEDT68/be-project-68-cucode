const CoworkingSpace = require("../models/CoworkingSpace");
const Booking = require("../models/Booking");

// @desc    Get all coworking spaces
// @route   GET /api/v1/coworkingspaces
// @access  Public
exports.getCoworkingSpaces = async (req, res, next) => {
  try {
    const coworkingspaces = await CoworkingSpace.find().populate("bookings");
    res.status(200).json({
      success: true,
      count: coworkingspaces.length,
      data: coworkingspaces,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc    Get single coworking space
// @route   GET /api/v1/coworkingspaces/:id
// @access  Public
exports.getCoworkingSpace = async (req, res, next) => {
  try {
    const coworkingspace = await CoworkingSpace.findById(req.params.id).populate("bookings");
    if (!coworkingspace) {
      return res.status(404).json({ success: false, message: "Coworking space not found" });
    }
    res.status(200).json({ success: true, data: coworkingspace });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc    Create new coworking space
// @route   POST /api/v1/coworkingspaces
// @access  Private (Admin)
exports.createCoworkingSpace = async (req, res, next) => {
  try {
    const coworkingspace = await CoworkingSpace.create(req.body);
    res.status(201).json({ success: true, data: coworkingspace });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc    Update coworking space
// @route   PUT /api/v1/coworkingspaces/:id
// @access  Private (Admin)
exports.updateCoworkingSpace = async (req, res, next) => {
  try {
    const coworkingspace = await CoworkingSpace.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!coworkingspace) {
      return res.status(404).json({ success: false, message: "Coworking space not found" });
    }
    res.status(200).json({ success: true, data: coworkingspace });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc    Delete coworking space (cascade delete bookings)
// @route   DELETE /api/v1/coworkingspaces/:id
// @access  Private (Admin)
exports.deleteCoworkingSpace = async (req, res, next) => {
  try {
    const coworkingspace = await CoworkingSpace.findById(req.params.id);
    if (!coworkingspace) {
      return res.status(404).json({ success: false, message: "Coworking space not found" });
    }
    await coworkingspace.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};
