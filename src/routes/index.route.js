const index = require('./routers/index.router');
const auth = require('./routers/auth.router');
const me = require('./routers/me.router');
const help = require('./routers/help.router');
const employ = require('./routers/employ.router');
const ticket = require('./routers/ticket.router');

const errorHandler = require('../app/middlewares/errorHandler');

function route(app) {
    app.use('/', index);
    app.use('/auth', auth);
    app.use('/me', me);
    app.use('/help', help);
    app.use('/employ', employ);
    app.use('/ticket', ticket);
    app.use(errorHandler);
}

module.exports = route;