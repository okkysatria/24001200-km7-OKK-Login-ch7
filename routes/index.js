const express = require('express');
const userController = require('../controllers/user');

const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login');
});
router.get('/forgot-password', (req, res) => {
    res.render('forgot-password');
});
router.get('/register', (req, res) => {
    res.render('register');
});
router.get('/reset-password', (req, res) => {
    const { token } = req.query;
    if (!token) {
        return res.status(400).send('Invalid or missing token');
    }
    res.render('reset-password', { token });
});


router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);

module.exports = router;
