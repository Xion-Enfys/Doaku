const express = require('express');
const router = express.Router();
const DoaController = require('../controllers/doaController');

// Doa routes
router.get('/doa', DoaController.getAllDoa);
router.get('/doa/:id', DoaController.getDoaById);
router.get('/quiz/:doaId', DoaController.getQuiz);

// Progress routes
router.post('/progress', DoaController.saveProgress);
router.get('/progress/:device_id', DoaController.getProgress);

module.exports = router;