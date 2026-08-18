import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CaptainDataContext } from '../context/CapatainContext'
import opersLogo from '../assets/OPERS.png'

const Captainlogin = () => {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ errorMessage, setErrorMessage ] = useState('')
  const [ isLoading, setIsLoading ] = useState(false)

  const { captain, setCaptain } = useContext(CaptainDataContext)
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrorMessage('')
    setIsLoading(true)

    const captainData = {
      email: email.trim().toLowerCase(),
      password
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`, captainData)

      if (response.status === 200) {
        const data = response.data
        setCaptain(data.captain)
        localStorage.setItem('token', data.token)
        navigate('/captain-home')
      }
    } catch (err) {
      console.error('Captain login error:', err)
      if (err.response?.data?.message) {
        setErrorMessage(err.response.data.message)
      } else if (err.response?.data?.errors?.length > 0) {
        setErrorMessage(err.response.data.errors.map(e => e.msg).join(', '))
      } else {
        setErrorMessage('Failed to sign in as Captain. Please verify your credentials.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const [ showGoogleModal, setShowGoogleModal ] = useState(false)
  const [ googleEmailInput, setGoogleEmailInput ] = useState('')
  const [ googleLoginLoading, setGoogleLoginLoading ] = useState(false)

  const handleGoogleSubmit = async (e) => {
    e.preventDefault();
    if (!googleEmailInput) return;
    setGoogleLoginLoading(true);
    setErrorMessage('');

    try {
      const emailClean = googleEmailInput.trim().toLowerCase();
      const firstnameClean = emailClean.split('@')[0];
      const googleCaptainPayload = {
        googleId: `google_captain_${emailClean.replace(/[^a-zA-Z0-9]/g, '_')}`,
        email: emailClean,
        firstname: firstnameClean,
        lastname: 'Captain',
        vehicle: { color: 'Black', plate: 'UP-32-GOOG', capacity: 4, vehicleType: 'car' }
      }

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/google-login`, googleCaptainPayload)
      if (response.status === 200) {
        setCaptain(response.data.captain)
        localStorage.setItem('token', response.data.token)
        setShowGoogleModal(false)
        navigate('/captain-home')
      }
    } catch (err) {
      console.error('Google captain login error:', err)
      setErrorMessage(err.response?.data?.message || 'Google authentication failed.')
    } finally {
      setGoogleLoginLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-slate-900 flex items-center justify-center sm:p-6 relative'>
      {/* Google Login Modal */}
      {showGoogleModal && (
        <div className='fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn'>
          <div className='bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative border border-gray-100'>
            <button
              onClick={() => setShowGoogleModal(false)}
              className='absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold p-1'
            >
              &times;
            </button>
            <div className='flex items-center gap-3 mb-4'>
              <svg className="w-8 h-8" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <div>
                <h3 className='text-lg font-bold text-gray-900'>Sign in with Google</h3>
                <p className='text-xs text-gray-500'>Choose your Google Account to continue as Captain</p>
              </div>
            </div>

            <form onSubmit={handleGoogleSubmit} className='mt-4'>
              <label className='block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2'>Enter your Google Email</label>
              <input
                required
                type="email"
                value={googleEmailInput}
                onChange={(e) => setGoogleEmailInput(e.target.value)}
                placeholder="captain@gmail.com"
                className='bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4'
              />

              <button
                type="submit"
                disabled={googleLoginLoading}
                className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 shadow-md flex items-center justify-center gap-2'
              >
                {googleLoginLoading ? 'Signing in...' : 'Sign in as Google Captain'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className='bg-white min-h-screen sm:min-h-[580px] w-full sm:max-w-md p-7 flex flex-col justify-between sm:rounded-3xl sm:shadow-2xl border-gray-200 overflow-y-auto'>
        <div>
          <div className='flex justify-center mb-5'>
            <img className='w-28 drop-shadow-sm' src={opersLogo} alt="OPERs Captain Logo" />
          </div>

          {errorMessage && (
            <div className='mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-start gap-2 animate-fadeIn'>
              <i className="ri-error-warning-line text-lg mt-0.5 flex-shrink-0 text-red-500"></i>
              <div className='flex-1'>
                <span>{errorMessage}</span>
                {errorMessage.toLowerCase().includes('not found') || errorMessage.toLowerCase().includes('invalid') ? (
                  <div className='mt-1'>
                    <Link to='/captain-signup' className='text-blue-600 font-semibold underline'>
                      Don't have an account? Register as Captain
                    </Link>
                  </div>
                ) : null}
              </div>
              <button onClick={() => setErrorMessage('')} className='text-gray-400 hover:text-gray-600'>&times;</button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowGoogleModal(true)}
            className='w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-3 shadow-sm hover:shadow transition duration-200 mb-4'
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-3 text-gray-500 text-xs font-semibold uppercase tracking-wider">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <form onSubmit={submitHandler}>
            <h3 className='text-base font-semibold mb-2 text-gray-900'>What's your email</h3>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='bg-[#eeeeee] mb-4 rounded-xl px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black w-full text-base placeholder:text-gray-400 transition'
              type="email"
              placeholder='captain@example.com'
            />

            <h3 className='text-base font-semibold mb-2 text-gray-900'>Enter Password</h3>
            <input
              className='bg-[#eeeeee] mb-5 rounded-xl px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black w-full text-base placeholder:text-gray-400 transition'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              placeholder='password'
            />

            <button
              type="submit"
              disabled={isLoading}
              className='bg-[#111] hover:bg-gray-800 disabled:bg-gray-500 text-white font-semibold mb-4 rounded-xl px-4 py-3 w-full text-base shadow-md transition duration-200 flex items-center justify-center gap-2'
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Logging in...</span>
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className='text-center py-2'>
            <p className='text-gray-600 text-sm'>
              Join a fleet?{' '}
              <Link to='/captain-signup' className='text-blue-600 font-bold hover:underline ml-1 inline-flex items-center gap-1'>
                Register as Captain &rarr;
              </Link>
            </p>
          </div>
        </div>

        <div className='mt-6 pt-4 border-t border-gray-100'>
          <Link
            to='/login'
            className='bg-[#d5622d] hover:bg-orange-700 flex items-center justify-center text-white font-semibold rounded-xl px-4 py-3 w-full text-base shadow-md transition duration-200'
          >
            Sign in as User
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Captainlogin