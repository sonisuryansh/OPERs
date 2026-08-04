const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const blackListTokenModel = require('../models/blackListToken.model');
const { validationResult } = require('express-validator');


module.exports.registerCaptain = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password, vehicle } = req.body;

    const isCaptainAlreadyExist = await captainModel.findOne({ email });

    if (isCaptainAlreadyExist) {
        return res.status(400).json({ message: 'Captain already exist' });
    }


    const hashedPassword = await captainModel.hashPassword(password);

    const captain = await captainService.createCaptain({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword,
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType
    });

    const token = captain.generateAuthToken();

    res.status(201).json({ token, captain });

}

module.exports.loginCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const captain = await captainModel.findOne({ email }).select('+password');

    if (!captain) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await captain.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = captain.generateAuthToken();

    res.cookie('token', token);

    res.status(200).json({ token, captain });
}

module.exports.getCaptainProfile = async (req, res, next) => {
    res.status(200).json({ captain: req.captain });
}

const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

module.exports.googleAuth = async (req, res, next) => {
    try {
        const { idToken, credential, email: bodyEmail, firstname: bodyFirstname, lastname: bodyLastname, googleId: bodyGoogleId, vehicle } = req.body;

        let email = bodyEmail;
        let firstname = bodyFirstname;
        let lastname = bodyLastname;
        let googleId = bodyGoogleId;

        const tokenToVerify = credential || idToken;

        if (tokenToVerify && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== 'your_google_client_id_here') {
            try {
                const ticket = await googleClient.verifyIdToken({
                    idToken: tokenToVerify,
                    audience: process.env.GOOGLE_CLIENT_ID,
                });
                const payload = ticket.getPayload();
                if (payload) {
                    email = payload.email;
                    firstname = payload.given_name || firstname;
                    lastname = payload.family_name || lastname;
                    googleId = payload.sub;
                }
            } catch (authErr) {
                console.warn('Google Captain Token verification fallback:', authErr.message);
            }
        }

        if (!email) {
            return res.status(400).json({ message: 'Valid Google account email is required' });
        }

        let captain = await captainModel.findOne({ email });

        if (!captain) {
            captain = await captainModel.create({
                fullname: {
                    firstname: firstname || 'Google',
                    lastname: lastname || 'Captain'
                },
                email,
                googleId: googleId || `google_${Date.now()}`,
                vehicle: vehicle || {
                    color: 'Black',
                    plate: 'UP-32-GOOG',
                    capacity: 4,
                    vehicleType: 'car'
                }
            });
        } else if (!captain.googleId) {
            captain.googleId = googleId || `google_${Date.now()}`;
            await captain.save();
        }

        const token = captain.generateAuthToken();
        res.cookie('token', token);
        return res.status(200).json({ token, captain });
    } catch (err) {
        console.error('Google Captain Auth Error:', err);
        return res.status(500).json({ message: err.message });
    }
};

module.exports.logoutCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

    await blackListTokenModel.create({ token });

    res.clearCookie('token');

    res.status(200).json({ message: 'Logout successfully' });
}