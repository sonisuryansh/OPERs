const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


module.exports.registerCaptain = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {
        fullname,
        email,
        password,
        vehicleColor,
        vehiclePlateNumber,
        vehicleCapacity,
        vehicleType
    } = req.body;
    const isCaptainExists = await captainModel.findOne({ email });
    if (isCaptainExists) {
        return res.status(400).json({ message: 'Captain with this email already exists' });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const captain = await captainService.registerCaptain({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashPassword,
        vehicleColor,
        vehiclePlateNumber,
        vehicleCapacity,
        vehicleType
    });
    const token = jwt.sign({ id: captain._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'Captain registered successfully', token });
}
