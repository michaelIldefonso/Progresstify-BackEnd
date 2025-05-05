const axios = require("axios");

const fetchEmails = async (accessToken) => {
    try {
        console.log("Fetching emails with access token:", accessToken); // Debug log
        const response = await axios.get("https://api.github.com/user/emails", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log("GitHub email response:", response.data); // Debug log
        return response.data; // Returns an array of email objects
    } catch (error) {
        console.error("Error fetching emails from GitHub:", error.response?.data || error.message); // Improved error logging
        throw new Error("Failed to fetch emails from GitHub");
    }
};

module.exports = { fetchEmails };
