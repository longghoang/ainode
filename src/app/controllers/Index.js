const axios = require('axios');
const createError = require('http-errors');

class IndexModel {
    async index (req, res, next) {
        const act = req.signedCookies.act;
        if(!act) return res.render('index', { data: null });
        try {
            const response = await axios.get(`${process.env.AUTH_SERVER}/data`, { headers: { 'Authorization': `Bearer ${act}` } });
            const user = response.data;
            console.log(user)
            return res.render('index', { user });
        } catch (error) {
            if (error.response) {
                next(createError(error.response.status, error.response.data.message));
            } else {
                next(createError(500, 'Internal server error'));
            }
        }
    }
}

module.exports = new IndexModel();