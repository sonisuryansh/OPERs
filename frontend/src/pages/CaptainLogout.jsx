import React, { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export const CaptainLogout = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('captain-token')
    const navigate = useNavigate()

    useEffect(() => {
        const logout = async () => {
            try {
                if (token) {
                    await axios.get(`${import.meta.env.VITE_BASE_URL}/captains/logout`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                }
            } catch (err) {
                console.error('Captain logout error:', err)
            } finally {
                localStorage.removeItem('token')
                localStorage.removeItem('captain-token')
                navigate('/captain-login')
            }
        }
        logout()
    }, [token, navigate])

    return (
        <div className='min-h-screen bg-slate-900 flex items-center justify-center text-white'>
            <div className='flex items-center gap-3'>
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>Logging out...</span>
            </div>
        </div>
    )
}

export default CaptainLogout