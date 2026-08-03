const captainModel = require('../models/captain.model');


module.exports.registerCaptain = async ({
    firstname, lastname, email, password, vehicleColor, vehiclePlateNumber, vehicleCapacity, vehicleType
}) => {
    if (!firstname || !email || !password || !vehicleColor || !vehiclePlateNumber || !vehicleCapacity || !vehicleType) {
        throw new Error('All fields are required');
    }
    const captain = captainModel.create({
        fullname: { firstname, lastname },
        email,
        password,
        vehicle: {
            color: vehicleColor,
            plateNumber: vehiclePlateNumber,
            vehicleType,
            capacity: vehicleCapacity
        }
    });
    return captain;
}