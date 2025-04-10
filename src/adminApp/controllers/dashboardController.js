const {
    getActiveAccounts,
    getNewUsers,
    getTotalUsers,
} = require('../models/userModel');

const fetchActiveAccounts = async (req, res) => {
    try {
        const activeAccounts = await getActiveAccounts();
        res.json({ activeAccounts });
    } catch (err) {
        console.error("Error fetching active accounts:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

const fetchNewUsers = async (req, res) => {
    try {
        const newUsers = await getNewUsers();
        res.json({ newUsers });
    } catch (err) {
        console.error("Error fetching new users:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

const fetchTotalUsers = async (req, res) => {
    try {
        const totalUsers = await getTotalUsers();
        res.json({ totalUsers });
    } catch (err) {
        console.error("Error fetching total users:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    fetchActiveAccounts,
    fetchNewUsers,
    fetchTotalUsers,
};
