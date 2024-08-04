const createError = require('http-errors');

module.exports = function errorFlow(error, next) {
    if (error.response) {
        console.log("Error status: ", error.response.status);
        console.log("Error status: ", error.response.data.message);
        next(createError(error.response.status, error.response.data.message));
    } else {
        console.log('Error!');
        next(createError(500, 'Internal server error'));
    }
}
