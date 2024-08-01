const index = require('./routers/index.router');
const auth = require('./routers/auth.router');
const me = require('./routers/me.router');
const help = require('./routers/help.router');
const employ = require('./routers/employ.router');
const ticket = require('./routers/ticket.router');
const scan = require('./routers/scan.router');
const revenue = require('./routers/revenue.router');
const forgotpw = require('./routers/forgotpw.router');

const errorHandler = require('../app/middlewares/errorHandler');

function route(app) {
    app.use('/', index);
    app.use('/auth', auth);
    app.use('/me', me);
    app.use('/help', help);
    app.use('/employ', employ);
    app.use('/ticket', ticket);
    app.use('/scan', scan);
    app.use('/revenue', revenue);
    app.use('/forgotpw', forgotpw);
    app.use(errorHandler);
}

module.exports = route;