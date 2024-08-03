const axios = require('axios');

module.exports = async function getData(act) {
    const response = await axios.get(`${process.env.AUTH_SERVER}/data`, { headers: { 'Authorization': `Bearer ${act}` }});
    return response.data;
}
