const axios = require('axios');
const createError = require('http-errors');

class Employ {
    index (req, res) {
        res.render('employ', { isEmploy: true });
    }
    async register(req, res, next) {
        const act = req.signedCookies.act;
        if(!act) {
            return res.redirect('/auth');
        }
        try {
            const response = await axios.get(`${process.env.AUTH_SERVER}/data`, { headers: { 'Authorization': `Bearer ${act}` }});
            const user = response.data;
            const email = user.email;
            const userData = {
                email,
                ...req.body
            }
            await axios.post(`${process.env.AUTH_SERVER}/register-employ`, userData);
            res.redirect('/');
        } catch (error) {
            // console.log(error);
            if (error.response) {
                next(createError(error.response.status, error.response.data.message));
            } else {
                next(createError(500, 'Internal server error'));
            }
        }
    }
}

module.exports = new Employ();