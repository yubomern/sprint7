const Reclamation = require('../models/Recalamtionstudent');

// Créer une réclamation
exports.createReclamation = async (req, res) => {
    try {
        const { title, description,userId } = req.body;

        console.log(userId);
        const reclamation = await Reclamation.create({
            user: userId,
            title,
            description
        });
        res.status(201).json(reclamation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupérer toutes les réclamations (Admin)
exports.getAllReclamations = async (req, res) => {
    try {
        const reclamations = await Reclamation.find().populate('user', 'firstName lastName email');
        res.status(200).json(reclamations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Répondre ou changer le statut
exports.updateReclamation = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, response } = req.body;

        const reclamation = await Reclamation.findByIdAndUpdate(
            id,
            { status, response, updatedAt: Date.now() },
            { new: true }
        );
        res.status(200).json(reclamation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupérer les réclamations d’un utilisateur
exports.getUserReclamations = async (req, res) => {

       const {userId}  =  req.body ;

    try {
        const reclamations = await Reclamation.find({ user: userId });
        res.status(200).json(reclamations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
