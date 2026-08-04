import React, { useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import FinishRide from '../components/FinishRide'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import LiveTracking from '../components/LiveTracking'
import opersLogo from '../assets/OPERS.png'

const CaptainRiding = () => {

    const [ finishRidePanel, setFinishRidePanel ] = useState(false)
    const finishRidePanelRef = useRef(null)
    const location = useLocation()
    const rideData = location.state?.ride

    useGSAP(function () {
        if (finishRidePanel) {
            gsap.to(finishRidePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(finishRidePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ finishRidePanel ])

    return (
        <div className='h-screen relative overflow-hidden bg-slate-900'>

            <div className='fixed p-6 top-0 flex items-center justify-between w-full z-20 pointer-events-none'>
                <img className='w-24 pointer-events-auto bg-white/90 p-1.5 rounded-xl shadow-md backdrop-blur-sm' src={opersLogo} alt="OPERs Logo" />
                <Link to='/captain-home' className='h-10 w-10 bg-white shadow-md flex items-center justify-center rounded-full pointer-events-auto hover:bg-gray-100 transition'>
                    <i className="text-lg font-medium ri-logout-box-r-line"></i>
                </Link>
            </div>

            <div className='fixed bottom-0 left-0 w-full md:w-[420px] md:left-6 md:bottom-6 z-10 p-6 bg-yellow-400 md:rounded-2xl md:shadow-2xl flex items-center justify-between cursor-pointer'
                onClick={() => {
                    setFinishRidePanel(true)
                }}
            >
                <h5 className='p-1 text-center w-[90%] absolute top-0'><i className="text-3xl text-gray-800 ri-arrow-up-wide-line"></i></h5>
                <h4 className='text-xl font-bold text-gray-900'>{'4 KM away'}</h4>
                <button className='bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-xl shadow-md transition duration-200'>Complete Ride</button>
            </div>
            <div ref={finishRidePanelRef} className='fixed w-full md:max-w-md md:left-1/2 md:-translate-x-1/2 z-[500] bottom-0 translate-y-full bg-white px-4 py-10 pt-12 rounded-t-3xl shadow-2xl border-t border-gray-100 overflow-y-auto max-h-[90vh]'>
                <FinishRide
                    ride={rideData}
                    setFinishRidePanel={setFinishRidePanel} />
            </div>

            <div className='h-screen w-screen absolute inset-0 z-0'>
                <LiveTracking />
            </div>

        </div>
    )
}

export default CaptainRiding