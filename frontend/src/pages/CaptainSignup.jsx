import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CapatainContext'
import axios from 'axios'
import opersLogo from '../assets/OPERS.png'

const CaptainSignup = () => {

  const navigate = useNavigate()

  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ firstName, setFirstName ] = useState('')
  const [ lastName, setLastName ] = useState('')

  const [ vehicleColor, setVehicleColor ] = useState('')
  const [ vehiclePlate, setVehiclePlate ] = useState('')
  const [ vehicleCapacity, setVehicleCapacity ] = useState('')
  const [ vehicleType, setVehicleType ] = useState('')

  const { captain, setCaptain } = React.useContext(CaptainDataContext)

  const submitHandler = async (e) => {
    e.preventDefault()
    const captainData = {
      fullname: {
        firstname: firstName,
        lastname: lastName
      },
      email: email,
      password: password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: vehicleCapacity,
        vehicleType: vehicleType
      }
    }

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, captainData)

    if (response.status === 201) {
      const data = response.data
      setCaptain(data.captain)
      localStorage.setItem('token', data.token)
      navigate('/captain-home')
    }

    setEmail('')
    setFirstName('')
    setLastName('')
    setPassword('')
    setVehicleColor('')
    setVehiclePlate('')
    setVehicleCapacity('')
    setVehicleType('')
  }

  return (
    <div className='min-h-screen bg-slate-900 flex items-center justify-center sm:p-6'>
      <div className='bg-white h-screen sm:h-auto sm:min-h-[700px] w-full sm:max-w-lg p-7 flex flex-col justify-between sm:rounded-3xl sm:shadow-2xl border-gray-200 overflow-y-auto'>
        <div>
          <div className='flex justify-center mb-6'>
            <img className='w-28 drop-shadow-sm' src={opersLogo} alt="OPERs Captain Logo" />
          </div>

          <form onSubmit={(e) => {
            submitHandler(e)
          }}>

            <h3 className='text-lg w-full font-medium mb-2 text-gray-900'>What's our Captain's name</h3>
            <div className='flex gap-4 mb-6'>
              <input
                required
                className='bg-[#eeeeee] w-1/2 rounded-xl px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-lg placeholder:text-base transition'
                type="text"
                placeholder='First name'
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value)
                }}
              />
              <input
                required
                className='bg-[#eeeeee] w-1/2 rounded-xl px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-lg placeholder:text-base transition'
                type="text"
                placeholder='Last name'
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value)
                }}
              />
            </div>

            <h3 className='text-lg font-medium mb-2 text-gray-900'>What's our Captain's email</h3>
            <input
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              className='bg-[#eeeeee] mb-6 rounded-xl px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black w-full text-lg placeholder:text-base transition'
              type="email"
              placeholder='email@example.com'
            />

            <h3 className='text-lg font-medium mb-2 text-gray-900'>Enter Password</h3>

            <input
              className='bg-[#eeeeee] mb-6 rounded-xl px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black w-full text-lg placeholder:text-base transition'
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
              }}
              required type="password"
              placeholder='password'
            />

            <h3 className='text-lg font-medium mb-2 text-gray-900'>Vehicle Information</h3>
            <div className='flex gap-4 mb-6'>
              <input
                required
                className='bg-[#eeeeee] w-1/2 rounded-xl px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-lg placeholder:text-base transition'
                type="text"
                placeholder='Vehicle Color'
                value={vehicleColor}
                onChange={(e) => {
                  setVehicleColor(e.target.value)
                }}
              />
              <input
                required
                className='bg-[#eeeeee] w-1/2 rounded-xl px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-lg placeholder:text-base transition'
                type="text"
                placeholder='Vehicle Plate'
                value={vehiclePlate}
                onChange={(e) => {
                  setVehiclePlate(e.target.value)
                }}
              />
            </div>
            <div className='flex gap-4 mb-6'>
              <input
                required
                className='bg-[#eeeeee] w-1/2 rounded-xl px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-lg placeholder:text-base transition'
                type="number"
                placeholder='Vehicle Capacity'
                value={vehicleCapacity}
                onChange={(e) => {
                  setVehicleCapacity(e.target.value)
                }}
              />
              <select
                required
                className='bg-[#eeeeee] w-1/2 rounded-xl px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black text-lg placeholder:text-base transition'
                value={vehicleType}
                onChange={(e) => {
                  setVehicleType(e.target.value)
                }}
              >
                <option value="" disabled>Select Vehicle Type</option>
                <option value="car">Car</option>
                <option value="auto">Auto</option>
                <option value="moto">Moto</option>
              </select>
            </div>

            <button
              className='bg-[#111] hover:bg-gray-800 text-white font-semibold mb-4 rounded-xl px-4 py-3 w-full text-lg shadow-md transition duration-200'
            >Create Captain Account</button>

          </form>
          <p className='text-center text-gray-600'>Already have an account? <Link to='/captain-login' className='text-blue-600 font-medium hover:underline'>Login here</Link></p>
        </div>
        <div className='mt-6'>
          <p className='text-[11px] leading-tight text-gray-500 text-center'>This site is protected by reCAPTCHA and the <span className='underline cursor-pointer'>Google Privacy Policy</span> and <span className='underline cursor-pointer'>Terms of Service</span> apply.</p>
        </div>
      </div>
    </div>
  )
}

export default CaptainSignup