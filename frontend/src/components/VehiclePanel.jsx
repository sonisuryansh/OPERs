import React from 'react'
import carImg from '../assets/car.svg'
import motoImg from '../assets/moto.svg'
import autoImg from '../assets/auto.svg'

const VehiclePanel = (props) => {
    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setVehiclePanel(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line cursor-pointer"></i></h5>
            <h3 className='text-2xl font-bold mb-5 text-gray-900'>Choose a Vehicle</h3>

            {/* OPERs Go (Car) */}
            <div 
                onClick={() => {
                    props.setConfirmRidePanel(true)
                    props.selectVehicle('car')
                }} 
                className='flex border-2 border-gray-200 active:border-black hover:border-gray-900 mb-3 rounded-2xl w-full p-3.5 items-center justify-between cursor-pointer hover:bg-gray-50 transition shadow-sm'
            >
                <div className='w-16 h-12 flex items-center justify-center flex-shrink-0'>
                    <img className='h-11 object-contain drop-shadow-sm' src={carImg} alt="OPERs Go" />
                </div>
                <div className='ml-3 flex-1'>
                    <h4 className='font-bold text-base text-gray-900 flex items-center gap-1.5'>
                        OPERs Go <span className='text-xs font-semibold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded-md flex items-center gap-0.5'><i className="ri-user-3-fill text-[11px]"></i>4</span>
                    </h4>
                    <h5 className='font-semibold text-xs text-gray-700 mt-0.5'>2 mins away</h5>
                    <p className='text-xs text-gray-500'>Affordable, compact rides</p>
                </div>
                <h2 className='text-xl font-bold text-gray-900'>₹{props.fare.car || 50}</h2>
            </div>

            {/* OPERs Moto */}
            <div 
                onClick={() => {
                    props.setConfirmRidePanel(true)
                    props.selectVehicle('moto')
                }} 
                className='flex border-2 border-gray-200 active:border-black hover:border-gray-900 mb-3 rounded-2xl w-full p-3.5 items-center justify-between cursor-pointer hover:bg-gray-50 transition shadow-sm'
            >
                <div className='w-16 h-12 flex items-center justify-center flex-shrink-0'>
                    <img className='h-11 object-contain drop-shadow-sm' src={motoImg} alt="OPERs Moto" />
                </div>
                <div className='ml-3 flex-1'>
                    <h4 className='font-bold text-base text-gray-900 flex items-center gap-1.5'>
                        OPERs Moto <span className='text-xs font-semibold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded-md flex items-center gap-0.5'><i className="ri-user-3-fill text-[11px]"></i>1</span>
                    </h4>
                    <h5 className='font-semibold text-xs text-gray-700 mt-0.5'>3 mins away</h5>
                    <p className='text-xs text-gray-500'>Fast & affordable bike rides</p>
                </div>
                <h2 className='text-xl font-bold text-gray-900'>₹{props.fare.moto || 20}</h2>
            </div>

            {/* OPERs Auto */}
            <div 
                onClick={() => {
                    props.setConfirmRidePanel(true)
                    props.selectVehicle('auto')
                }} 
                className='flex border-2 border-gray-200 active:border-black hover:border-gray-900 mb-3 rounded-2xl w-full p-3.5 items-center justify-between cursor-pointer hover:bg-gray-50 transition shadow-sm'
            >
                <div className='w-16 h-12 flex items-center justify-center flex-shrink-0'>
                    <img className='h-11 object-contain drop-shadow-sm' src={autoImg} alt="OPERs Auto" />
                </div>
                <div className='ml-3 flex-1'>
                    <h4 className='font-bold text-base text-gray-900 flex items-center gap-1.5'>
                        OPERs Auto <span className='text-xs font-semibold text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded-md flex items-center gap-0.5'><i className="ri-user-3-fill text-[11px]"></i>3</span>
                    </h4>
                    <h5 className='font-semibold text-xs text-gray-700 mt-0.5'>3 mins away</h5>
                    <p className='text-xs text-gray-500'>Affordable, doorstep Auto rides</p>
                </div>
                <h2 className='text-xl font-bold text-gray-900'>₹{props.fare.auto || 30}</h2>
            </div>
        </div>
    )
}

export default VehiclePanel