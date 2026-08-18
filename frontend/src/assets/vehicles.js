import carImg from './car.svg'
import motoImg from './moto.svg'
import autoImg from './auto.svg'

export const vehicleImages = {
    car: carImg,
    moto: motoImg,
    motorcycle: motoImg,
    auto: autoImg
}

export const getVehicleImage = (type) => {
    if (!type) return carImg
    const clean = type.toLowerCase()
    return vehicleImages[clean] || carImg
}

export default vehicleImages
