const express = require('express');
const attendaneController = require('../controllers/attendaneController');
const router = express.Router();

router.post("/check", attendaneController.chechAttendance);
router.post("/mark", attendaneController.attendanceMark);
router.get("/report", attendaneController.attendanceReport);

module.exports = router