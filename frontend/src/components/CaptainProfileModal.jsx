import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const CaptainProfileModal = ({ isOpen, onClose, captain }) => {
    const navigate = useNavigate()

    if (!isOpen) return null

    const firstName = captain?.fullname?.firstname || 'Captain'
    const lastName = captain?.fullname?.lastname || ''
    const fullName = `${firstName} ${lastName}`.trim()
    const email = captain?.email || 'captain@example.com'
    const initials = (firstName.charAt(0) + (lastName ? lastName.charAt(0) : '')).toUpperCase() || 'C'

    const vehicle = captain?.vehicle || {}

    const handleLogout = async () => {
        const token = localStorage.getItem('token') || localStorage.getItem('captain-token')
        try {
            if (token) {
                await axios.get(`${import.meta.env.VITE_BASE_URL}/captains/logout`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            }
        } catch (err) {
            console.error('Logout error:', err)
        } finally {
            localStorage.removeItem('token')
            localStorage.removeItem('captain-token')
            navigate('/captain-login')
        }
    }

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn'>
            <div 
                className='bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-gray-100 relative animate-slideUp flex flex-col max-h-[90vh]'
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className='bg-gradient-to-r from-emerald-900 via-slate-800 to-black text-white p-6 relative flex-shrink-0'>
                    <button
                        onClick={onClose}
                        className='absolute top-5 right-5 h-9 w-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-xl transition'
                        aria-label="Close profile"
                    >
                        &times;
                    </button>

                    <div className='flex items-center gap-4'>
                        <div className='w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center text-2xl font-bold shadow-lg border-2 border-white/30'>
                            {initials}
                        </div>
                        <div>
                            <div className='flex items-center gap-2'>
                                <h3 className='text-xl font-bold'>{fullName}</h3>
                                <span className='bg-emerald-500/20 text-emerald-300 text-[11px] px-2 py-0.5 rounded-full font-medium border border-emerald-500/30 flex items-center gap-1'>
                                    <i className="ri-checkbox-circle-fill text-xs text-emerald-400"></i> Active Captain
                                </span>
                            </div>
                            <p className='text-gray-300 text-xs mt-0.5'>{email}</p>
                            <div className='flex items-center gap-2 mt-2'>
                                <span className='bg-white/10 text-white text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 font-medium'>
                                    <i className="ri-star-fill text-yellow-400 text-xs"></i> 4.98 Rating
                                </span>
                                <span className='bg-white/10 text-white text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 font-medium'>
                                    <i className="ri-steering-line text-emerald-400 text-xs"></i> Top Driver
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Body */}
                <div className='p-6 overflow-y-auto space-y-5 flex-1'>
                    {/* Vehicle Details Card */}
                    <div className='bg-gray-50 border border-gray-100 rounded-2xl p-4 shadow-sm'>
                        <span className='text-xs font-bold text-gray-400 uppercase tracking-wider'>Vehicle Information</span>
                        <div className='grid grid-cols-2 gap-3 mt-3'>
                            <div className='bg-white p-3 rounded-xl border border-gray-100'>
                                <span className='text-[10px] text-gray-500 uppercase font-semibold'>Vehicle Type</span>
                                <div className='text-sm font-bold text-gray-800 capitalize'>{vehicle.vehicleType || 'Car'}</div>
                            </div>
                            <div className='bg-white p-3 rounded-xl border border-gray-100'>
                                <span className='text-[10px] text-gray-500 uppercase font-semibold'>Plate Number</span>
                                <div className='text-sm font-bold text-gray-800 uppercase'>{vehicle.plate || 'N/A'}</div>
                            </div>
                            <div className='bg-white p-3 rounded-xl border border-gray-100'>
                                <span className='text-[10px] text-gray-500 uppercase font-semibold'>Color</span>
                                <div className='text-sm font-bold text-gray-800 capitalize'>{vehicle.color || 'Black'}</div>
                            </div>
                            <div className='bg-white p-3 rounded-xl border border-gray-100'>
                                <span className='text-[10px] text-gray-500 uppercase font-semibold'>Capacity</span>
                                <div className='text-sm font-bold text-gray-800'>{vehicle.capacity || 4} Passengers</div>
                            </div>
                        </div>
                    </div>

                    {/* Earnings Summary */}
                    <div className='bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-4 flex items-center justify-between shadow-sm'>
                        <div>
                            <span className='text-xs font-semibold uppercase tracking-wider text-emerald-700'>Today's Earnings</span>
                            <div className='text-2xl font-black text-gray-900 mt-0.5'>₹1,840.50</div>
                            <span className='text-[11px] text-gray-500'>6 completed rides</span>
                        </div>
                        <button className='bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-3.5 rounded-xl transition shadow-sm'>
                            Cash Out
                        </button>
                    </div>

                    {/* Switch Mode Banner */}
                    <div className='bg-slate-900 text-white rounded-2xl p-4 flex items-center justify-between shadow-md'>
                        <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-xl text-white'>
                                <i className="ri-user-line"></i>
                            </div>
                            <div>
                                <div className='text-sm font-bold'>Book a Ride as Rider</div>
                                <div className='text-xs text-gray-300'>Switch to passenger mode</div>
                            </div>
                        </div>
                        <Link 
                            to='/login' 
                            className='bg-white hover:bg-gray-100 text-slate-900 text-xs font-bold py-2 px-3 rounded-xl transition shadow-sm'
                        >
                            Rider Mode
                        </Link>
                    </div>
                </div>

                {/* Modal Footer / Logout */}
                <div className='p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between flex-shrink-0'>
                    <button
                        onClick={handleLogout}
                        className='w-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2 text-sm border border-red-200'
                    >
                        <i className="ri-logout-box-r-line text-base"></i>
                        <span>Log Out Captain</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CaptainProfileModal
