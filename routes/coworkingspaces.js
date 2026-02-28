const express = require('express');
const {
    getCoworkingSpaces, 
    getCoworkingSpace, 
    createCoworkingSpace, 
    updateCoworkingSpace, 
    deleteCoworkingSpace
} = require('../controllers/coworkingspaces');

// 1. นำเข้า Booking Router
const bookingRouter = require('./bookings');

const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

/**
 * @swagger
 * components:
 *   schemas:
 *     CoworkingSpace:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - tel
 *         - open_close_time
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the coworking space
 *           example: d290f1ee-6c54-4b01-90e6-d701748f0851
 *         name:
 *           type: string
 *           description: Coworking space name
 *         address:
 *           type: string
 *           description: House No., Street, Road
 *         tel:
 *           type: string
 *           description: telephone number
 *         open_close_time:
 *           type: string
 *           description: open-close time (e.g., 08:00-18:00)
 *       example:
 *         id: 609bda561452242d88d36e37
 *         name: CU Coworking Space
 *         address: 254 Phayathai Road, Wang Mai, Pathum Wan, Bangkok
 *         tel: 02-215-0830
 *         open_close_time: 08:00-20:00
 */

/**
 * @swagger
 * tags:
 *   name: CoworkingSpaces
 *   description: The coworking spaces managing API
 */

/**
 * @swagger
 * /coworkingspaces:
 *   get:
 *     summary: Returns the list of all the coworking spaces
 *     tags: [CoworkingSpaces]
 *     responses:
 *       200:
 *         description: The list of the coworking spaces
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CoworkingSpace'
 *   post:
 *     summary: Create a new coworking space
 *     tags: [CoworkingSpaces]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CoworkingSpace'
 *     responses:
 *       201:
 *         description: The coworking space was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CoworkingSpace'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /coworkingspaces/{id}:
 *   get:
 *     summary: Get the coworking space by id
 *     tags: [CoworkingSpaces]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The coworking space id
 *     responses:
 *       200:
 *         description: The coworking space description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CoworkingSpace'
 *       404:
 *         description: The coworking space was not found
 *   put:
 *     summary: Update the coworking space by id
 *     tags: [CoworkingSpaces]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The coworking space id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CoworkingSpace'
 *     responses:
 *       200:
 *         description: The coworking space was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CoworkingSpace'
 *       404:
 *         description: The coworking space was not found
 *       500:
 *         description: Some error happened
 *   delete:
 *     summary: Remove the coworking space by id
 *     tags: [CoworkingSpaces]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The coworking space id
 *     responses:
 *       200:
 *         description: The coworking space was deleted
 *       404:
 *         description: The coworking space was not found
 */

// 2. Re-route เข้าสู่ resource อื่น (Nested Route)
// เมื่อมี request เข้ามาที่ /:coworkingspaceId/bookings จะถูกส่งต่อไปที่ bookingRouter
router.use('/:coworkingspaceId/bookings', bookingRouter);

router.route('/')
    .get(getCoworkingSpaces)
    .post(protect, authorize('admin'), createCoworkingSpace);

router.route('/:id')
    .get(getCoworkingSpace)
    .put(protect, authorize('admin'), updateCoworkingSpace)
    .delete(protect, authorize('admin'), deleteCoworkingSpace);

module.exports = router;