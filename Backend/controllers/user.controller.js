const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const blackListTokenModel = require('../models/blackListToken.model');

module.exports.registerUser = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;

    const isUserAlready = await userModel.findOne({ email });

    if (isUserAlready) {
        return res.status(400).json({ message: 'User already exist' });
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword
    });

    const token = user.generateAuthToken();

    res.status(201).json({ token, user });


}

module.exports.loginUser = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select('+password');

    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = user.generateAuthToken();

    res.cookie('token', token);

    res.status(200).json({ token, user });
}

module.exports.getUserProfile = async (req, res, next) => {

    res.status(200).json(req.user);

}

const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

module.exports.googleAuth = async (req, res, next) => {
    try {
        const { idToken, credential, email: bodyEmail, firstname: bodyFirstname, lastname: bodyLastname, googleId: bodyGoogleId } = req.body;

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
                console.warn('Google Token verification fallback:', authErr.message);
            }
        }

        if (!email) {
            return res.status(400).json({ message: 'Valid Google account email is required' });
        }

        let user = await userModel.findOne({ email });

        if (!user) {
            user = await userModel.create({
                fullname: {
                    firstname: firstname || 'Google',
                    lastname: lastname || 'User'
                },
                email,
                googleId: googleId || `google_${Date.now()}`
            });
        } else if (!user.googleId) {
            user.googleId = googleId || `google_${Date.now()}`;
            await user.save();
        }

        const token = user.generateAuthToken();
        res.cookie('token', token);
        return res.status(200).json({ token, user });
    } catch (err) {
        console.error('Google Auth Controller Error:', err);
        return res.status(500).json({ message: err.message });
    }
};

module.exports.logoutUser = async (req, res, next) => {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];

    await blackListTokenModel.create({ token });

    res.status(200).json({ message: 'Logged out' });
}