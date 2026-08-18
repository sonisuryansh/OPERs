import React, { useRef, useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import CaptainProfileModal from '../components/CaptainProfileModal'
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CapatainContext'
import axios from 'axios'
import opersLogo from '../assets/OPERS.png'

const CaptainHome = () => {
    const [ ridePopupPanel, setRidePopupPanel ] = useState(false)
    const [ confirmRidePopupPanel, setConfirmRidePopupPanel ] = useState(false)
    const [ profileOpen, setProfileOpen ] = useState(false)

    const ridePopupPanelRef = useRef(null)
    const confirmRidePopupPanelRef = useRef(null)
    const [ ride, setRide ] = useState(null)

    const { socket } = useContext(SocketContext)
    const { captain } = useContext(CaptainDataContext)

    useEffect(() => {
        if (!captain || !socket) return;
        socket.emit('join', {
            userId: captain._id,
            userType: 'captain'
        })
        const updateLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    socket.emit('update-location-captain', {
                        userId: captain._id,
                        location: {
                            ltd: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    })
                })
            }
        }

        const locationInterval = setInterval(updateLocation, 10000)
        updateLocation()

        const handleNewRide = (data) => {
            setRide(data)
            setRidePopupPanel(true)
        }

        socket.on('new-ride', handleNewRide)

        return () => {
            clearInterval(locationInterval)
            socket.off('new-ride', handleNewRide)
        }
    }, [ captain, socket ])

    async function confirmRide() {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {
            rideId: ride._id,
            captainId: captain._id,
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        setRidePopupPanel(false)
        setConfirmRidePopupPanel(true)
    }

    useGSAP(function () {
        if (ridePopupPanel) {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ ridePopupPanel ])

    useGSAP(function () {
        if (confirmRidePopupPanel) {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ confirmRidePopupPanel ])

    const captainName = captain?.fullname?.firstname || 'Captain'
    const captainInitial = captainName.charAt(0).toUpperCase() || 'C'

    return (
        <div className='h-screen relative overflow-hidden bg-slate-900'>
            {/* Top Navigation Bar */}
            <div className='fixed p-5 top-0 flex items-center justify-between w-full z-20 pointer-events-none'>
                <img className='w-24 pointer-events-auto bg-white/90 p-1.5 rounded-xl shadow-md backdrop-blur-sm' src={opersLogo} alt="OPERs Logo" />
                
                <div className='flex items-center gap-3 pointer-events-auto'>
                    <button
                        onClick={() => setProfileOpen(true)}
                        className='bg-white/95 hover:bg-white backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-gray-200/80 flex items-center gap-2.5 transition duration-200 hover:scale-[1.02] active:scale-95 group'
                        aria-label="Open Captain profile"
                    >
                        <div className='w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold flex items-center justify-center text-sm shadow-md'>
                            {captainInitial}
                        </div>
                        <div className='hidden sm:flex flex-col text-left'>
                            <span className='text-xs font-semibold text-gray-900 leading-tight group-hover:text-emerald-600 transition'>
                                {captainName}
                            </span>
                            <span className='text-[10px] text-gray-500 font-medium'>
                                Captain Profile
                            </span>
                        </div>
                        <i className="ri-arrow-down-s-line text-gray-400 text-base group-hover:text-gray-700 transition"></i>
                    </button>
                </div>
            </div>

            {/* Map View */}
            <div className='h-screen w-screen absolute inset-0 z-0'>
                <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="Map View" />
            </div>

            {/* Bottom Captain Details Sheet */}
            <div className='fixed bottom-0 left-0 w-full md:w-[420px] md:left-6 md:bottom-6 z-10 p-6 bg-white md:rounded-2xl md:shadow-2xl md:border md:border-gray-200'>
                <CaptainDetails />
            </div>

            {/* Popups */}
            <div ref={ridePopupPanelRef} className='fixed w-full md:max-w-md md:left-1/2 md:-translate-x-1/2 z-30 bottom-0 translate-y-full bg-white px-4 py-10 pt-12 rounded-t-3xl shadow-2xl border-t border-gray-100'>
                <RidePopUp
                    ride={ride}
                    setRidePopupPanel={setRidePopupPanel}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    confirmRide={confirmRide}
                />
            </div>
            <div ref={confirmRidePopupPanelRef} className='fixed w-full md:max-w-md md:left-1/2 md:-translate-x-1/2 h-screen md:h-auto md:max-h-[90vh] z-30 bottom-0 translate-y-full bg-white px-4 py-10 pt-12 rounded-t-3xl shadow-2xl border-t border-gray-100 overflow-y-auto'>
                <ConfirmRidePopUp
                    ride={ride}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel} setRidePopupPanel={setRidePopupPanel} />
            </div>

            {/* Captain Profile Modal */}
            <CaptainProfileModal
                isOpen={profileOpen}
                onClose={() => setProfileOpen(false)}
                captain={captain}
            />
        </div>
    )
}

export default CaptainHome