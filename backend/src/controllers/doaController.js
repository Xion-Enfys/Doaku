const DoaModel = require('../models/doaModel');

const DoaController = {
    // Get all doa
    getAllDoa: async (req, res) => {
        try {
            const doaList = await DoaModel.getAll();
            res.json({ success: true, data: doaList });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Get doa by id
    getDoaById: async (req, res) => {
        try {
            const doa = await DoaModel.getById(req.params.id);
            if (doa) {
                res.json({ success: true, data: doa });
            } else {
                res.status(404).json({ success: false, error: 'Doa not found' });
            }
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Get quiz for doa
    getQuiz: async (req, res) => {
        try {
            const quiz = await DoaModel.getQuizByDoaId(req.params.doaId);
            res.json({ success: true, data: quiz });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Save progress
    saveProgress: async (req, res) => {
        try {
            const { device_id, doa_id, status, score } = req.body;
            const result = await DoaModel.saveProgress(device_id, doa_id, status, score);
            res.json({ success: true, data: result });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    },

    // Get progress
    getProgress: async (req, res) => {
        try {
            const { device_id } = req.params;
            const progress = await DoaModel.getProgress(device_id);
            res.json({ success: true, data: progress });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
};

module.exports = DoaController;