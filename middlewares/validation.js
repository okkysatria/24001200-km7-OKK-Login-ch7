const HttpRequestError = require('../utils/error');

function validateRegister({ fullName, email, password }) {
    if (!fullName || !email || !password) throw new HttpRequestError('All fields are required', 400);
    if (!/^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) throw new HttpRequestError('Invalid email format', 400);
}

function validateLogin({ email, password }) {
    if (!email || !password) throw new HttpRequestError('Email and password are required', 400);
}

function validateForgotPassword({ email }) {
    if (!email) throw new HttpRequestError('Email is required', 400);
}

function validateResetPassword({ token, password }) {
    if (!token || !password) throw new HttpRequestError('Token and password are required', 400);
}

module.exports = { validateRegister, validateLogin, validateForgotPassword, validateResetPassword };
