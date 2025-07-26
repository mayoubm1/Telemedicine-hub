const express = require("express");
const router = express.Router();
const { getPatientAssistResponse } = require("../controllers/patientAssistController");
const { authenticateToken: auth } = require('../middleware/auth');

// Route for patients to get AI assistance from the doctor AI
router.post("/query", auth, getPatientAssistResponse);

module.exports = router;

