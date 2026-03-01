const express = require("express");
const {
  getCoworkingSpaces,
  getCoworkingSpace,
  createCoworkingSpace,
  updateCoworkingSpace,
  deleteCoworkingSpace,
} = require("../controllers/coworkingspaces");

// Include booking router for re-routing
const bookingRouter = require("./bookings");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

// Re-route into booking router
router.use("/:coworkingspaceId/bookings", bookingRouter);

/**
 * @swagger
 * tags:
 *   name: Coworking Spaces
 *   description: CRUD operations for Coworking Spaces
 */

/**
 * @swagger
 * /coworkingspaces:
 *   get:
 *     summary: Get all coworking spaces
 *     tags: [Coworking Spaces]
 *     responses:
 *       200:
 *         description: List of coworking spaces
 *   post:
 *     summary: Create a new coworking space
 *     tags: [Coworking Spaces]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Coworking space created
 *       401:
 *         description: Not authorized
 */
router
  .route("/")
  .get(getCoworkingSpaces)
  .post(protect, authorize("admin"), createCoworkingSpace);

/**
 * @swagger
 * /coworkingspaces/{id}:
 *   get:
 *     summary: Get single coworking space
 *     tags: [Coworking Spaces]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Coworking space data
 *       404:
 *         description: Not found
 *   put:
 *     summary: Update coworking space
 *     tags: [Coworking Spaces]
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
 *         description: Updated successfully
 *   delete:
 *     summary: Delete coworking space (cascade deletes bookings)
 *     tags: [Coworking Spaces]
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
 *         description: Deleted successfully
 */
router
  .route("/:id")
  .get(getCoworkingSpace)
  .put(protect, authorize("admin"), updateCoworkingSpace)
  .delete(protect, authorize("admin"), deleteCoworkingSpace);

module.exports = router;
