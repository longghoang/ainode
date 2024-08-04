const createError = require('http-errors');

module.exports = function errorFlow(error, next) {
    if (error.response) {
        console.log("Error status: ", error.response.status);
        const errorMessage = error.response.data && error.response.data.message
            ? error.response.data.message
            : 'An error occurred';
        console.log("Error message: ", errorMessage);
        next(createError(error.response.status, errorMessage));
    } else {
        console.log('Error!');
        next(createError(500, 'Internal server error'));
    }
}
