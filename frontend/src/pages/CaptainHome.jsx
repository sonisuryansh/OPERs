import React, { useRef, useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CapatainContext'
import axios from 'axios'
import opersLogo from '../assets/OPERS.png'

const CaptainHome = () => {

    const [ ridePopupPanel, setRidePopupPanel ] = useState(false)
    const [ confirmRidePopupPanel, setConfirmRidePopupPanel ] = useState(false)

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

    return (
        <div className='h-screen relative overflow-hidden bg-slate-900'>
            <div className='fixed p-6 top-0 flex items-center justify-between w-full z-20 pointer-events-none'>
                <img className='w-24 pointer-events-auto bg-white/90 p-1.5 rounded-xl shadow-md backdrop-blur-sm' src={opersLogo} alt="OPERs Logo" />
                <Link to='/captain-home' className='h-10 w-10 bg-white shadow-md flex items-center justify-center rounded-full pointer-events-auto hover:bg-gray-100 transition'>
                    <i className="text-lg font-medium ri-logout-box-r-line"></i>
                </Link>
            </div>
            <div className='h-screen w-screen absolute inset-0 z-0'>
                <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="Map View" />
            </div>
            <div className='fixed bottom-0 left-0 w-full md:w-[420px] md:left-6 md:bottom-6 z-10 p-6 bg-white md:rounded-2xl md:shadow-2xl md:border md:border-gray-200'>
                <CaptainDetails />
            </div>
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
        </div>
    )
}

export default CaptainHome