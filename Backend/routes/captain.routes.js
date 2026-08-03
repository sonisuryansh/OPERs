const captainController = require('../controllers/captain.controller');
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth.middleware');


router.post('/register', [
    body('fullname').notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('vehicleColor').notEmpty().withMessage('Vehicle color is required'),
    body('vehiclePlateNumber').notEmpty().withMessage('Vehicle plate number is required'),
    body('vehicleCapacity').isInt({ min: 1 }).withMessage('Vehicle capacity must be at least 1'),
    body('vehicleType').isIn(['car', 'bike', 'auto', 'van']).withMessage('Invalid vehicle type'),
],
    captainController.registerCaptain
);

router.post('/login', [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required'),
],
    captainController.loginCaptain
);
router.get('/logout', authMiddleware.authCaptain, captainController.logoutCaptain);

router.get('/profile', authMiddleware.authCaptain, captainController.getCaptainProfile);

module.exports = router;