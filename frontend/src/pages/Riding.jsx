import React from 'react'
import { Link, useLocation } from 'react-router-dom' // Added useLocation
import { useEffect, useContext } from 'react'
import { SocketContext } from '../context/SocketContext'
import { useNavigate } from 'react-router-dom'
import LiveTracking from '../components/LiveTracking'
import { getVehicleImage } from '../assets/vehicles'

const Riding = () => {
    const location = useLocation()
    const { ride } = location.state || {} // Retrieve ride data
    const { socket } = useContext(SocketContext)
    const navigate = useNavigate()

    const vehicleType = ride?.captain?.vehicle?.vehicleType || 'car'
    const vehicleIcon = getVehicleImage(vehicleType)

    useEffect(() => {
        if (!socket) return;
        const handleRideEnded = () => {
            navigate('/home')
        }
        socket.on("ride-ended", handleRideEnded)
        return () => {
            socket.off("ride-ended", handleRideEnded)
        }
    }, [ socket, navigate ])


    return (
        <div className='h-screen relative overflow-hidden bg-slate-900'>
            <Link to='/home' className='fixed right-4 top-4 h-10 w-10 bg-white shadow-md z-20 flex items-center justify-center rounded-full hover:bg-gray-100 transition'>
                <i className="text-lg font-medium ri-home-5-line"></i>
            </Link>
            <div className='h-screen w-screen absolute inset-0 z-0'>
                <LiveTracking />
            </div>
            <div className='fixed bottom-0 left-0 w-full md:w-[420px] md:left-6 md:bottom-6 z-10 p-5 bg-white md:rounded-2xl md:shadow-2xl md:border md:border-gray-200 overflow-y-auto max-h-[90vh]'>
                <div className='flex items-center justify-between'>
                    <img className='h-14 object-contain drop-shadow-sm' src={vehicleIcon} alt="Vehicle" />
                    <div className='text-right'>
                        <h2 className='text-lg font-bold capitalize text-gray-900'>{ride?.captain.fullname.firstname}</h2>
                        <h4 className='text-xl font-bold -mt-1 -mb-1 text-gray-900'>{ride?.captain.vehicle.plate}</h4>
                        <p className='text-sm text-gray-600 capitalize'>{ride?.captain?.vehicle?.color} {vehicleType}</p>
                    </div>
                </div>

                <div className='flex gap-2 justify-between flex-col items-center'>
                    <div className='w-full mt-5'>

                        <div className='flex items-center gap-5 p-3 border-b border-gray-100'>
                            <i className="text-lg ri-map-pin-2-fill text-gray-800"></i>
                            <div>
                                <h3 className='text-lg font-medium text-gray-900'>Destination</h3>
                                <p className='text-sm -mt-1 text-gray-600'>{ride?.destination}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-5 p-3'>
                            <i className="ri-currency-line text-lg text-gray-800"></i>
                            <div>
                                <h3 className='text-lg font-medium text-gray-900'>₹{ride?.fare} </h3>
                                <p className='text-sm -mt-1 text-gray-600'>Cash Payment</p>
                            </div>
                        </div>
                    </div>
                </div>
                <button className='w-full mt-5 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl shadow-md transition duration-200'>Make a Payment</button>
            </div>
        </div>
    )
}

export default Riding