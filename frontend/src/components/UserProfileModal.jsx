import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const UserProfileModal = ({ isOpen, onClose, user }) => {
    const navigate = useNavigate()

    if (!isOpen) return null

    const firstName = user?.fullname?.firstname || user?.fullName?.firstName || 'Rider'
    const lastName = user?.fullname?.lastname || user?.fullName?.lastName || ''
    const fullName = `${firstName} ${lastName}`.trim()
    const email = user?.email || 'user@example.com'
    const initials = (firstName.charAt(0) + (lastName ? lastName.charAt(0) : '')).toUpperCase() || 'U'

    const handleLogout = async () => {
        const token = localStorage.getItem('token')
        try {
            if (token) {
                await axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            }
        } catch (err) {
            console.error('Logout error:', err)
        } finally {
            localStorage.removeItem('token')
            navigate('/login')
        }
    }

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn'>
            <div 
                className='bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-gray-100 relative animate-slideUp flex flex-col max-h-[90vh]'
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className='bg-gradient-to-r from-gray-900 via-slate-800 to-black text-white p-6 relative flex-shrink-0'>
                    <button
                        onClick={onClose}
                        className='absolute top-5 right-5 h-9 w-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white text-xl transition'
                        aria-label="Close profile"
                    >
                        &times;
                    </button>

                    <div className='flex items-center gap-4'>
                        <div className='w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center text-2xl font-bold shadow-lg border-2 border-white/30'>
                            {initials}
                        </div>
                        <div>
                            <div className='flex items-center gap-2'>
                                <h3 className='text-xl font-bold'>{fullName}</h3>
                                <span className='bg-emerald-500/20 text-emerald-300 text-[11px] px-2 py-0.5 rounded-full font-medium border border-emerald-500/30 flex items-center gap-1'>
                                    <i className="ri-checkbox-circle-fill text-xs text-emerald-400"></i> Verified
                                </span>
                            </div>
                            <p className='text-gray-300 text-xs mt-0.5'>{email}</p>
                            <div className='flex items-center gap-2 mt-2'>
                                <span className='bg-white/10 text-white text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 font-medium'>
                                    <i className="ri-star-fill text-yellow-400 text-xs"></i> 4.95 Rating
                                </span>
                                <span className='bg-white/10 text-white text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 font-medium'>
                                    <i className="ri-car-line text-blue-400 text-xs"></i> OPERs Gold
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Body */}
                <div className='p-6 overflow-y-auto space-y-5 flex-1'>
                    {/* OPERs Wallet Card */}
                    <div className='bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4 flex items-center justify-between shadow-sm'>
                        <div>
                            <span className='text-xs font-semibold uppercase tracking-wider text-blue-700'>OPERs Wallet</span>
                            <div className='text-2xl font-black text-gray-900 mt-0.5'>₹250.00</div>
                            <span className='text-[11px] text-gray-500'>Available for your next ride</span>
                        </div>
                        <button className='bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-3.5 rounded-xl transition shadow-sm flex items-center gap-1'>
                            <i className="ri-add-line"></i> Top Up
                        </button>
                    </div>

                    {/* Quick Menu Options */}
                    <div className='space-y-2'>
                        <h4 className='text-xs font-bold text-gray-400 uppercase tracking-wider px-1'>Account & Preferences</h4>
                        
                        <div className='bg-gray-50 rounded-2xl p-2 border border-gray-100 space-y-1'>
                            <div className='flex items-center justify-between p-3 rounded-xl hover:bg-white hover:shadow-sm transition cursor-pointer'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-lg'>
                                        <i className="ri-map-pin-user-line"></i>
                                    </div>
                                    <div>
                                        <div className='text-sm font-semibold text-gray-800'>Saved Places</div>
                                        <div className='text-xs text-gray-500'>Home, Work & Favorites</div>
                                    </div>
                                </div>
                                <i className="ri-arrow-right-s-line text-gray-400 text-xl"></i>
                            </div>

                            <div className='flex items-center justify-between p-3 rounded-xl hover:bg-white hover:shadow-sm transition cursor-pointer'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-lg'>
                                        <i className="ri-history-line"></i>
                                    </div>
                                    <div>
                                        <div className='text-sm font-semibold text-gray-800'>Ride History</div>
                                        <div className='text-xs text-gray-500'>View past trips & receipts</div>
                                    </div>
                                </div>
                                <i className="ri-arrow-right-s-line text-gray-400 text-xl"></i>
                            </div>

                            <div className='flex items-center justify-between p-3 rounded-xl hover:bg-white hover:shadow-sm transition cursor-pointer'>
                                <div className='flex items-center gap-3'>
                                    <div className='w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg'>
                                        <i className="ri-shield-check-line"></i>
                                    </div>
                                    <div>
                                        <div className='text-sm font-semibold text-gray-800'>Safety & Emergency</div>
                                        <div className='text-xs text-gray-500'>Emergency contacts & 24/7 SOS</div>
                                    </div>
                                </div>
                                <i className="ri-arrow-right-s-line text-gray-400 text-xl"></i>
                            </div>
                        </div>
                    </div>

                    {/* Switch Mode Banner */}
                    <div className='bg-slate-900 text-white rounded-2xl p-4 flex items-center justify-between shadow-md'>
                        <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-xl text-white'>
                                <i className="ri-steering-fill"></i>
                            </div>
                            <div>
                                <div className='text-sm font-bold'>Drive with OPERs</div>
                                <div className='text-xs text-gray-300'>Earn on your own schedule</div>
                            </div>
                        </div>
                        <Link 
                            to='/captain-login' 
                            className='bg-white hover:bg-gray-100 text-slate-900 text-xs font-bold py-2 px-3 rounded-xl transition shadow-sm'
                        >
                            Captain Mode
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
                        <span>Log Out</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default UserProfileModal
