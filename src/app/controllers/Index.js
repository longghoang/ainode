const axios = require('axios');
const errorFlow = require('../utils/errorFlow.util');

class IndexModel {
    async index (req, res, next) {
        const act = req.signedCookies.act;
        const status = req.cookies.status;
        if(!act) return res.render('index');
        try {
            const response = await axios.get(`${process.env.AUTH_SERVER}/data`, { headers: { 'Authorization': `Bearer ${act}` } });
            const user = response.data;
            return res.render('index', { user, status });
        } catch (error) {
            errorFlow(error, next);
        }
    }
}

module.exports = new IndexModel();
