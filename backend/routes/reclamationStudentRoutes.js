const express = require('express');
const router = express.Router();
const reclamationController = require('../controllers/ReaclamtionControllers');


// Utilisateur crée une réclamation
router.post('/', reclamationController.createReclamation);

// Utilisateur récupère ses réclamations
router.get('/me', reclamationController.getUserReclamations);

// Admin récupère toutes les réclamations
router.get('/', reclamationController.getAllReclamations);

// Admin répond ou change le statut
router.put('/:id', reclamationController.updateReclamation);

module.exports = router;
