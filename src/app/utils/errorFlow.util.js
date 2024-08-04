const createError = require('http-errors');

module.exports = function errorFlow(error, next) {
    if (error.response) {
        console.log("Error status: ", error.response.status);
        console.log("Error response data: ", error.response.data);

        let errorMessage;
        
        if (typeof error.response.data === 'string' && error.response.data.includes('<html')) {
            // If the response data is HTML, provide a generic error message
            errorMessage = 'Received HTML error response from server';
        } else if (error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
        } else if (error.response.data && error.response.data.error) {
            errorMessage = error.response.data.error;
        } else {
            errorMessage = 'An error occurred';
        }

        console.log("Error message: ", errorMessage);
        next(createError(error.response.status, errorMessage));
    } else {
        console.log('Error!');
        next(createError(500, 'Internal server error'));
    }
}
