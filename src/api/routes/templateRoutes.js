const express = require('express');
const router = express.Router();
const templateController = require('../controllers/templateController');

router.get('/templates', templateController.getAllTemplates);
router.post('/templates', templateController.createTemplate);

module.exports = router;