const express = require('express');
const studentController = require('../controllers/studentController');
const router = express.Router();

router.post("/add", studentController.addNewStudent);
router.get("/get", studentController.getAllStudent);

module.exports = router