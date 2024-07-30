const axios = require('axios');

const UserModel = require('../models/User.model');

const getNewAccessToken = async (refreshToken) => {
    try {
        const response = await axios.post(`${process.env.AUTH_SERVER}/token`, {refreshToken});
        return response.data.accessToken;
    } catch (error) {
        console.error('Error getting new accessToken:', error);
        throw error;
    }
};

module.exports = async function errorHandler (err, req, res, next) {
    switch (err.status) {
        case 401:
            return res.send('401');
        case 403:
            console.log('Is errorHandle 403');
            const uid = req.signedCookies.uid;
            if(!uid) {
                res.redirect('/login');
            }
            try {
                const user = await UserModel.findById(uid);
                if(!user) return res.status(404).json({ message: 'User not found!' });
                const refreshToken = user.refreshToken;
                const newAccessToken = await getNewAccessToken(refreshToken);
                const cookieOptions = {
                    signed: true,
                    maxAge: 3600000
                };
                if(req.url === '/') {
                    return res.cookie('act', newAccessToken, cookieOptions).render('index', {
                        user
                    });
                }
                if(req.url === '/me') {
                    return res.cookie('act', newAccessToken, cookieOptions).render('me', {
                        user
                    });
                }
                return res.render('index');
            } catch (error) {
                return res.status(500).json({ message: 'Failed to get new access token!' });
            }
        case 404:
            return res.send('404');
        case 409:
            return res.cookie('status', 'conflict', {
                maxAge: 60000
            })
            .redirect('/auth');
        case 500:
            return res.send('500');
        default:
            console.log(err);
            return res.send('Error');
    }
}
