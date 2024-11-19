const Sentry = require('@sentry/node');
const HttpRequestError = require('../utils/error');

module.exports = (err, req, res, next) => {
    Sentry.captureException(err);
    console.error(err);
    
    if (err instanceof HttpRequestError) {
        return res.status(err.statusCode).json({
            status: 'Fail',
            message: err.message,
        });
    }

    res.status(500).json({
        status: 'Fail',
        message: 'Internal server error',
    });
};
