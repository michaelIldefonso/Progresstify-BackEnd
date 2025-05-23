// Import the axios library for making HTTP requests
const axios = require("axios");

// Function to fetch emails associated with a GitHub account using an access token
const fetchEmails = async (accessToken) => {
    try {
        // Make a GET request to the GitHub API to retrieve user emails
        const response = await axios.get("https://api.github.com/user/emails", {
            headers: {
                Authorization: `Bearer ${accessToken}`, // Include the access token in the Authorization header
            },
        });
        
        return response.data; // Return the array of email objects from the response
    } catch (error) {
        // Log detailed error information for debugging purposes
        console.error("Error fetching emails from GitHub:", error.response?.data || error.message);
        throw new Error("Failed to fetch emails from GitHub"); // Throw a new error if the request fails
    }
};

// Export the fetchEmails function for use in other modules
module.exports = { fetchEmails };
