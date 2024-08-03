const axios = require('axios');
const errorFlow = require('../utils/errorFlow.util');

class Employ {
    async index (req, res, next) {
        const act = req.signedCookies.act;
        if(!act) return res.redirect('/auth');
        try {
            const response = await axios.get(`${process.env.AUTH_SERVER}/data`, { headers: { 'Authorization': `Bearer ${act}` } });
            const user = response.data;
            if(user.name==="User" || user.birth===null || user.add===null || user.phoneNumber===null) {
                return res.cookie('status', 'update-error', {maxAge: 2000})
                .redirect('/');
            }
            return res.render('employ', { isEmploy: true });
        } catch (error) {
            errorFlow(error, next);
        }
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
            errorFlow(error, next);
        }
    }
}

module.exports = new Employ();
