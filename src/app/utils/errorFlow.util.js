const createError = require('http-errors');

module.exports = function errorFlow(error, next) {
    if (error.response) {
        console.log("Error status: ", error.response.status);
        console.log("Error response data: ", error.response.data);

        // Extract error message from response data, with fallback options
        const errorMessage = (error.response.data && error.response.data.message) ||
                             (error.response.data && error.response.data.error) ||
                             'An error occurred';

        console.log("Error message: ", errorMessage);
        next(createError(error.response.status, errorMessage));
    } else {
        console.log('Error!');
        next(createError(500, 'Internal server error'));
    }
}
