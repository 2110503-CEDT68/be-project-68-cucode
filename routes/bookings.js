const express = require("express");
const {
  getBookings,
  getBooking,
  addBooking,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookings");

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: CRUD operations for Bookings
 */

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get all bookings (user=own, admin=all)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings
 */

/**
 * @swagger
 * /coworkingspaces/{coworkingspaceId}/bookings:
 *   post:
 *     summary: Create a booking for a coworking space (max 3 per user)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: coworkingspaceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Booking created
 *       400:
 *         description: Booking limit reached (3 per user)
 */
router
  .route("/")
  .get(protect, getBookings)
  .post(protect, authorize("admin", "user"), addBooking);

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: Get single booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking data
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update booking (owner or admin)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Updated successfully
 *   delete:
 *     summary: Delete booking (owner or admin)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Deleted successfully
 */
router
  .route("/:id")
  .get(protect, getBooking)
  .put(protect, authorize("admin", "user"), updateBooking)
  .delete(protect, authorize("admin", "user"), deleteBooking);

module.exports = router;
