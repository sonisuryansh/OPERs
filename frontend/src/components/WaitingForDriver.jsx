import React from 'react'
import { getVehicleImage } from '../assets/vehicles'

const WaitingForDriver = (props) => {
  const vehicleType = props.ride?.captain?.vehicle?.vehicleType || 'car'
  const vehicleIcon = getVehicleImage(vehicleType)

  return (
    <div>
      <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
        props.waitingForDriver(false)
      }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line cursor-pointer"></i></h5>

      <div className='flex items-center justify-between mt-2 p-3 bg-gray-50 rounded-2xl border border-gray-100'>
        <img className='h-14 object-contain drop-shadow-sm' src={vehicleIcon} alt="Vehicle" />
        <div className='text-right'>
          <h2 className='text-base font-bold capitalize text-gray-900'>{props.ride?.captain.fullname.firstname}</h2>
          <h4 className='text-lg font-black text-gray-800 tracking-wider'>{props.ride?.captain.vehicle.plate}</h4>
          <p className='text-xs text-gray-500 capitalize'>{props.ride?.captain?.vehicle?.color} {vehicleType}</p>
          <div className='mt-1 bg-black text-white px-2.5 py-0.5 rounded-lg text-xs font-bold inline-block'>
            OTP: {props.ride?.otp}
          </div>
        </div>
      </div>

      <div className='flex gap-2 justify-between flex-col items-center'>
        <div className='w-full mt-4'>
          <div className='flex items-center gap-4 p-3 border-b border-gray-100'>
            <div className='w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0'>
              <i className="ri-map-pin-user-fill"></i>
            </div>
            <div className='flex-1 overflow-hidden'>
              <h3 className='text-xs font-semibold text-gray-500 uppercase'>Pickup</h3>
              <p className='text-sm font-medium text-gray-900 truncate'>{props.ride?.pickup}</p>
            </div>
          </div>
          <div className='flex items-center gap-4 p-3 border-b border-gray-100'>
            <div className='w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0'>
              <i className="ri-map-pin-2-fill"></i>
            </div>
            <div className='flex-1 overflow-hidden'>
              <h3 className='text-xs font-semibold text-gray-500 uppercase'>Destination</h3>
              <p className='text-sm font-medium text-gray-900 truncate'>{props.ride?.destination}</p>
            </div>
          </div>
          <div className='flex items-center gap-4 p-3'>
            <div className='w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0'>
              <i className="ri-currency-line"></i>
            </div>
            <div>
              <h3 className='text-lg font-bold text-gray-900'>₹{props.ride?.fare}</h3>
              <p className='text-xs text-gray-500'>Cash / UPI</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WaitingForDriver