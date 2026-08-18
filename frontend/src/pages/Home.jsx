import React, { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import UserProfileModal from '../components/UserProfileModal';
import { SocketContext } from '../context/SocketContext';
import { useContext } from 'react';
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import LiveTracking from '../components/LiveTracking';
import opersLogo from '../assets/OPERS.png';

const Home = () => {
    const [ pickup, setPickup ] = useState('')
    const [ destination, setDestination ] = useState('')
    const [ panelOpen, setPanelOpen ] = useState(false)
    const [ profileOpen, setProfileOpen ] = useState(false)
    const vehiclePanelRef = useRef(null)
    const confirmRidePanelRef = useRef(null)
    const vehicleFoundRef = useRef(null)
    const waitingForDriverRef = useRef(null)
    const panelRef = useRef(null)
    const panelCloseRef = useRef(null)
    const [ vehiclePanel, setVehiclePanel ] = useState(false)
    const [ confirmRidePanel, setConfirmRidePanel ] = useState(false)
    const [ vehicleFound, setVehicleFound ] = useState(false)
    const [ waitingForDriver, setWaitingForDriver ] = useState(false)
    const [ pickupSuggestions, setPickupSuggestions ] = useState([])
    const [ destinationSuggestions, setDestinationSuggestions ] = useState([])
    const [ activeField, setActiveField ] = useState('pickup')
    const [ fare, setFare ] = useState({})
    const [ vehicleType, setVehicleType ] = useState(null)
    const [ ride, setRide ] = useState(null)

    const navigate = useNavigate()

    const { socket } = useContext(SocketContext)
    const { user } = useContext(UserDataContext)

    useEffect(() => {
        if (!user || !socket) return;
        socket.emit("join", { userType: "user", userId: user._id })

        const handleRideConfirmed = (ride) => {
            setVehicleFound(false)
            setWaitingForDriver(true)
            setRide(ride)
        }

        const handleRideStarted = (ride) => {
            setWaitingForDriver(false)
            navigate('/riding', { state: { ride } })
        }

        socket.on('ride-confirmed', handleRideConfirmed)
        socket.on('ride-started', handleRideStarted)

        return () => {
            socket.off('ride-confirmed', handleRideConfirmed)
            socket.off('ride-started', handleRideStarted)
        }
    }, [ user, socket, navigate ])


    const handlePickupChange = async (e) => {
        setPickup(e.target.value)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }

            })
            setPickupSuggestions(response.data)
        } catch {
            // handle error
        }
    }

    const handleDestinationChange = async (e) => {
        setDestination(e.target.value)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setDestinationSuggestions(response.data)
        } catch {
            // handle error
        }
    }

    const submitHandler = (e) => {
        e.preventDefault()
    }

    useGSAP(function () {
        if (panelOpen) {
            gsap.to(panelRef.current, {
                height: '70%',
                padding: 24
            })
            gsap.to(panelCloseRef.current, {
                opacity: 1
            })
        } else {
            gsap.to(panelRef.current, {
                height: '0%',
                padding: 0
            })
            gsap.to(panelCloseRef.current, {
                opacity: 0
            })
        }
    }, [ panelOpen ])


    useGSAP(function () {
        if (vehiclePanel) {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ vehiclePanel ])

    useGSAP(function () {
        if (confirmRidePanel) {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ confirmRidePanel ])

    useGSAP(function () {
        if (vehicleFound) {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ vehicleFound ])

    useGSAP(function () {
        if (waitingForDriver) {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ waitingForDriver ])


    async function findTrip() {
        setVehiclePanel(true)
        setPanelOpen(false)

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
            params: { pickup, destination },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        setFare(response.data)
    }

    async function createRide() {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
            pickup,
            destination,
            vehicleType
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
    }

    const firstName = user?.fullname?.firstname || user?.fullName?.firstName || 'Rider'
    const userInitial = firstName.charAt(0).toUpperCase() || 'U'

    return (
        <div className='h-screen relative overflow-hidden bg-slate-900'>
            {/* Live Tracking Map Background */}
            <div className='h-screen w-screen absolute inset-0 z-0'>
                <LiveTracking
                    activeField={activeField}
                    pickup={pickup}
                    destination={destination}
                    onLocationSelect={(address) => {
                        if (activeField === 'destination') {
                            setDestination(address);
                        } else {
                            setPickup(address);
                        }
                    }}
                />
            </div>

            {/* Top Right Floating Profile Button */}
            <div className='fixed top-5 right-5 z-20 flex items-center gap-3'>
                <button
                    onClick={() => setProfileOpen(true)}
                    className='bg-white/95 hover:bg-white backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-gray-200/80 flex items-center gap-2.5 transition duration-200 hover:scale-[1.02] active:scale-95 group'
                    aria-label="Open profile"
                >
                    <div className='w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-md'>
                        {userInitial}
                    </div>
                    <div className='hidden sm:flex flex-col text-left'>
                        <span className='text-xs font-semibold text-gray-900 leading-tight group-hover:text-blue-600 transition'>
                            {firstName}
                        </span>
                        <span className='text-[10px] text-gray-500 font-medium'>
                            My Profile
                        </span>
                    </div>
                    <i className="ri-arrow-down-s-line text-gray-400 text-base group-hover:text-gray-700 transition"></i>
                </button>
            </div>

            {/* Left Panel: Find a trip */}
            <div className='flex flex-col justify-end h-screen absolute top-0 w-full md:w-[420px] md:left-6 md:top-6 md:h-auto md:max-h-[calc(100vh-3rem)] z-10 pointer-events-none'>
                <div className='pointer-events-auto bg-white p-6 relative md:rounded-2xl md:shadow-2xl md:border md:border-gray-200'>
                    <div className='flex items-center justify-between mb-3'>
                        <img className='w-24 drop-shadow-sm' src={opersLogo} alt="OPERs Logo" />
                        <div className='flex items-center gap-2'>
                            <button
                                onClick={() => setProfileOpen(true)}
                                className='w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition shadow-sm'
                                title="View Profile"
                            >
                                <i className="ri-user-3-line text-lg"></i>
                            </button>
                            <h5 
                                ref={panelCloseRef} 
                                onClick={() => setPanelOpen(false)} 
                                className='opacity-0 text-2xl cursor-pointer hover:text-gray-600 transition'
                            >
                                <i className="ri-arrow-down-wide-line"></i>
                            </h5>
                        </div>
                    </div>
                    <h4 className='text-2xl font-bold text-gray-900'>Find a trip</h4>
                    <form className='relative py-3' onSubmit={submitHandler}>
                        <div className="line absolute h-14 w-1 top-[48%] -translate-y-1/2 left-5 bg-gray-900 rounded-full"></div>
                        <input
                            onClick={() => {
                                setPanelOpen(true)
                                setActiveField('pickup')
                            }}
                            value={pickup}
                            onChange={handlePickupChange}
                            className='bg-[#eee] px-12 py-3 text-lg rounded-xl w-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black transition'
                            type="text"
                            placeholder='Add a pick-up location'
                        />
                        <input
                            onClick={() => {
                                setPanelOpen(true)
                                setActiveField('destination')
                            }}
                            value={destination}
                            onChange={handleDestinationChange}
                            className='bg-[#eee] px-12 py-3 text-lg rounded-xl w-full mt-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black transition'
                            type="text"
                            placeholder='Enter your destination' />
                    </form>
                    <button
                        onClick={findTrip}
                        className='bg-black hover:bg-gray-800 text-white font-medium px-4 py-3 rounded-xl mt-3 w-full text-lg shadow-md transition duration-200'>
                        Find Trip
                    </button>
                </div>
                <div ref={panelRef} className='pointer-events-auto bg-white h-0 overflow-y-auto md:rounded-b-2xl'>
                    <LocationSearchPanel
                        suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
                        setPanelOpen={setPanelOpen}
                        setVehiclePanel={setVehiclePanel}
                        setPickup={setPickup}
                        setDestination={setDestination}
                        activeField={activeField}
                    />
                </div>
            </div>

            {/* Ride Selection Panels */}
            <div ref={vehiclePanelRef} className='fixed w-full md:max-w-md md:left-1/2 md:-translate-x-1/2 z-20 bottom-0 translate-y-full bg-white px-4 py-10 pt-12 rounded-t-3xl shadow-2xl border-t border-gray-100'>
                <VehiclePanel
                    selectVehicle={setVehicleType}
                    fare={fare} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} />
            </div>
            <div ref={confirmRidePanelRef} className='fixed w-full md:max-w-md md:left-1/2 md:-translate-x-1/2 z-20 bottom-0 translate-y-full bg-white px-4 py-6 pt-12 rounded-t-3xl shadow-2xl border-t border-gray-100'>
                <ConfirmRide
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    setConfirmRidePanel={setConfirmRidePanel} setVehicleFound={setVehicleFound} />
            </div>
            <div ref={vehicleFoundRef} className='fixed w-full md:max-w-md md:left-1/2 md:-translate-x-1/2 z-20 bottom-0 translate-y-full bg-white px-4 py-6 pt-12 rounded-t-3xl shadow-2xl border-t border-gray-100'>
                <LookingForDriver
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    setVehicleFound={setVehicleFound} />
            </div>
            <div ref={waitingForDriverRef} className='fixed w-full md:max-w-md md:left-1/2 md:-translate-x-1/2 z-20 bottom-0 bg-white px-4 py-6 pt-12 rounded-t-3xl shadow-2xl border-t border-gray-100'>
                <WaitingForDriver
                    ride={ride}
                    setVehicleFound={setVehicleFound}
                    setWaitingForDriver={setWaitingForDriver}
                    waitingForDriver={waitingForDriver} />
            </div>

            {/* User Profile Modal */}
            <UserProfileModal
                isOpen={profileOpen}
                onClose={() => setProfileOpen(false)}
                user={user}
            />
        </div>
    )
}

export default Home