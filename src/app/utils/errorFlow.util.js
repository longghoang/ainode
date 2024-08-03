const createError = require('http-errors');

module.exports = function errorFlow(error, next) {
    if (error.response) {
        console.log("Error status: ", error.response.status);
        next(createError(error.response.status, "Error"));
    } else {
        console.log('Error!');
        next(createError(500, 'Internal server error'));
    }
}
