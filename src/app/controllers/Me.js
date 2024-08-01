const axios = require('axios');
const createError = require('http-errors');

class Me {
    async index (req, res, next) {
        const act = req.signedCookies.act;
        const status = req.cookies.status;
        if(!act) {
            return res.redirect('/auth');
        }
        try {
            const response = await axios.get(`${process.env.AUTH_SERVER}/data`, { headers: { 'Authorization': `Bearer ${act}` }});
            const user = response.data; 
            return res.render('me', { isMe: true, user, status });
        } catch (error) {
            if (error.response) {
                next(createError(error.response.status, error.response.data.message));
            } else {
                next(createError(500, 'Internal server error'));
            }
        }
    }
    async update (req, res, next) {
        const uid = req.signedCookies.uid;
        const userData = req.body;
        userData.uid = uid;
        if(!userData.email || !uid) return res.status(400).json({ message: 'Invalid request data' });
        try {
            await axios.patch(`${process.env.AUTH_SERVER}/update-info`, userData);
            return res.cookie('status', 'update-success', {maxAge: 2000})
            .redirect('/me');
        } catch (error) {
            console.log(error);
            return res.send('Error');
        }
    }
}

module.exports = new Me();