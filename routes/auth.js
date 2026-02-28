const express = require("express"); // [cite: 69]
const { register, login, getMe ,logout} = require("../controllers/auth"); // [cite: 70]
const router = express.Router(); // [cite: 71]
const { protect } = require("../middleware/auth");
router.post("/register", register); // [cite: 72]
router.post("/login", login);
router.get("/me", protect, getMe);
router.get("/logout",logout);
module.exports = router; // [cite: 73]
