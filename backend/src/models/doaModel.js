const pool = require('../config/database');

const DoaModel = {
    // Get all doa
    getAll: async () => {
        const [rows] = await pool.query('SELECT * FROM doa ORDER BY urutan');
        return rows;
    },

    // Get doa by id
    getById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM doa WHERE id = ?', [id]);
        return rows[0];
    },

    // Get quiz by doa_id
    getQuizByDoaId: async (doaId) => {
        const [rows] = await pool.query('SELECT * FROM quiz WHERE doa_id = ?', [doaId]);
        return rows;
    },

    // Save or update progress
    saveProgress: async (deviceId, doaId, status, score) => {
        const [result] = await pool.query(
            `INSERT INTO progress (device_id, doa_id, status, score, tanggal_belajar) 
             VALUES (?, ?, ?, ?, CURDATE()) 
             ON DUPLICATE KEY UPDATE 
             status = VALUES(status), 
             score = VALUES(score), 
             tanggal_belajar = CURDATE()`,
            [deviceId, doaId, status, score]
        );
        return result;
    },

    // Get progress by device_id
    getProgress: async (deviceId) => {
        const [rows] = await pool.query(
            `SELECT p.*, d.nama_doa 
             FROM progress p 
             JOIN doa d ON p.doa_id = d.id 
             WHERE p.device_id = ?`,
            [deviceId]
        );
        return rows;
    }
};

module.exports = DoaModel;