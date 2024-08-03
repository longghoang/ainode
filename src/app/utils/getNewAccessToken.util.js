const axios = require('axios');

module.exports= async function getNewAccessToken(uid) {
    try {
        const response = await axios.post(`${process.env.AUTH_SERVER}/token`, {uid});
        return response.data.accessToken;
    } catch (error) {
        console.error('Error getting new accessToken:', error);
        throw error;
    }
};