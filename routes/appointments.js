const express = require('express');
const {
    getAppointments,
    getAppointment,
    addAppointment,
    updateAppointment,
    deleteAppointment
} = require('../controllers/appointments');

const { protect, authorize } = require('../middleware/auth');

// ตั้งค่า mergeParams: true เพื่อให้สามารถรับค่า params (เช่น hospitalId) ที่ถูกส่งต่อมาจาก route อื่นได้
const router = express.Router({ mergeParams: true });

router.route('/')
    .get(protect, getAppointments)
    .post(protect, authorize('admin', 'user'), addAppointment);

router.route('/:id')
    .get(protect, getAppointment)
    .put(protect, authorize('admin', 'user'), updateAppointment)
    .delete(protect, authorize('admin', 'user'), deleteAppointment);

module.exports = router;