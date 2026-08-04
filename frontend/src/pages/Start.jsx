
import React from 'react'
import { Link } from 'react-router-dom'
import opersLogo from '../assets/OPERS.png'

const Start = () => {
  return (
    <div className='min-h-screen bg-slate-900 flex items-center justify-center sm:p-6'>
      <div className='bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1619059558110-c45be64b73ae?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)] h-screen sm:h-[650px] w-full sm:max-w-md pt-8 flex justify-between flex-col sm:rounded-3xl sm:overflow-hidden sm:shadow-2xl border-gray-800'>
        <div className='flex justify-center pt-2'>
          <img className='w-28 drop-shadow-md' src={opersLogo} alt="OPERs Logo" />
        </div>
        <div className='bg-white pb-8 py-5 px-6 sm:rounded-b-3xl'>
          <h2 className='text-[28px] sm:text-[30px] font-bold text-gray-900'>Get Started with OPERs</h2>
          <Link to='/login' className='flex items-center justify-center w-full bg-black text-white font-medium py-3 rounded-xl mt-5 hover:bg-gray-800 transition duration-200 shadow-md'>
            Continue
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Start