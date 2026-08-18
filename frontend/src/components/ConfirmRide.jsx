import React from 'react'
import { getVehicleImage } from '../assets/vehicles'

const ConfirmRide = (props) => {
    const vehicleIcon = getVehicleImage(props.vehicleType)

    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setConfirmRidePanel(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line cursor-pointer"></i></h5>
            <h3 className='text-2xl font-bold mb-5 text-gray-900'>Confirm your Ride</h3>

            <div className='flex gap-2 justify-between flex-col items-center'>
                <div className='w-28 h-16 flex items-center justify-center'>
                    <img className='h-14 object-contain drop-shadow-md' src={vehicleIcon} alt={props.vehicleType} />
                </div>
                <div className='w-full mt-4'>
                    <div className='flex items-center gap-4 p-3 border-b border-gray-100'>
                        <div className='w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0'>
                            <i className="ri-map-pin-user-fill"></i>
                        </div>
                        <div className='flex-1 overflow-hidden'>
                            <h3 className='text-xs font-semibold text-gray-500 uppercase'>Pickup</h3>
                            <p className='text-sm font-medium text-gray-900 truncate'>{props.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-4 p-3 border-b border-gray-100'>
                        <div className='w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0'>
                            <i className="ri-map-pin-2-fill"></i>
                        </div>
                        <div className='flex-1 overflow-hidden'>
                            <h3 className='text-xs font-semibold text-gray-500 uppercase'>Destination</h3>
                            <p className='text-sm font-medium text-gray-900 truncate'>{props.destination}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-4 p-3'>
                        <div className='w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0'>
                            <i className="ri-currency-line"></i>
                        </div>
                        <div>
                            <h3 className='text-lg font-bold text-gray-900'>₹{props.fare[ props.vehicleType ]}</h3>
                            <p className='text-xs text-gray-500'>Cash / UPI Payment</p>
                        </div>
                    </div>
                </div>
                <button onClick={() => {
                    props.setVehicleFound(true)
                    props.setConfirmRidePanel(false)
                    props.createRide()
                }} className='w-full mt-4 bg-black hover:bg-gray-800 text-white font-semibold py-3.5 rounded-xl shadow-lg transition duration-200'>
                    Confirm Ride
                </button>
            </div>
        </div>
    )
}

export default ConfirmRide