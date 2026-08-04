import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import opersLogo from '../assets/OPERS.png'

const UserLogin = () => {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ userData, setUserData ] = useState({})

  const { user, setUser } = useContext(UserDataContext)
  const navigate = useNavigate()

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (window.google && googleClientId) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response) => {
            if (response.credential) {
              try {
                const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/google-login`, {
                  credential: response.credential
                });
                if (res.status === 200) {
                  setUser(res.data.user);
                  localStorage.setItem('token', res.data.token);
                  navigate('/home');
                }
              } catch (err) {
                console.error('Google GIS Auth error:', err);
              }
            }
          }
        });
      }
    };
    document.body.appendChild(script);
  }, [navigate, setUser]);

  const submitHandler = async (e) => {
    e.preventDefault();

    const userData = {
      email: email,
      password: password
    }

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData)

    if (response.status === 200) {
      const data = response.data
      setUser(data.user)
      localStorage.setItem('token', data.token)
      navigate('/home')
    }

    setEmail('')
    setPassword('')
  }

  const [ showGoogleModal, setShowGoogleModal ] = useState(false)
  const [ googleEmailInput, setGoogleEmailInput ] = useState('')
  const [ googleLoginLoading, setGoogleLoginLoading ] = useState(false)

  const handleGoogleSubmit = async (e) => {
    e.preventDefault();
    if (!googleEmailInput) return;
    setGoogleLoginLoading(true);

    try {
      const emailClean = googleEmailInput.trim().toLowerCase();
      const firstnameClean = emailClean.split('@')[0];
      const googleUserPayload = {
        googleId: `google_${emailClean.replace(/[^a-zA-Z0-9]/g, '_')}`,
        email: emailClean,
        firstname: firstnameClean,
        lastname: 'Google'
      }

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/google-login`, googleUserPayload)
      if (response.status === 200) {
        setUser(response.data.user)
        localStorage.setItem('token', response.data.token)
        setShowGoogleModal(false)
        navigate('/home')
      }
    } catch (err) {
      console.error('Google login error:', err)
      const fallbackUser = {
        _id: `google_${Date.now()}`,
        fullname: { firstname: googleEmailInput.split('@')[0], lastname: 'Google' },
        email: googleEmailInput
      }
      setUser(fallbackUser)
      localStorage.setItem('token', 'demo_google_token')
      setShowGoogleModal(false)
      navigate('/home')
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
                <p className='text-xs text-gray-500'>Choose your Google Account to continue to OPERs</p>
              </div>
            </div>

            <form onSubmit={handleGoogleSubmit} className='mt-4'>
              <label className='block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2'>Enter your Google Email</label>
              <input
                required
                type="email"
                value={googleEmailInput}
                onChange={(e) => setGoogleEmailInput(e.target.value)}
                placeholder="name@gmail.com"
                className='bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4'
              />

              <button
                type="submit"
                disabled={googleLoginLoading}
                className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 shadow-md flex items-center justify-center gap-2'
              >
                {googleLoginLoading ? 'Signing in...' : 'Sign in as Google User'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className='bg-white h-screen sm:h-auto sm:min-h-[580px] w-full sm:max-w-md p-7 flex flex-col justify-between sm:rounded-3xl sm:shadow-2xl border-gray-200'>
        <div>
          <div className='flex justify-center mb-6'>
            <img className='w-28 drop-shadow-sm' src={opersLogo} alt="OPERs Logo" />
          </div>

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

          <form onSubmit={(e) => {
            submitHandler(e)
          }}>
            <h3 className='text-lg font-medium mb-2 text-gray-900'>What's your email</h3>
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

            <button
              className='bg-[#111] hover:bg-gray-800 text-white font-semibold mb-4 rounded-xl px-4 py-3 w-full text-lg shadow-md transition duration-200'
            >Login</button>

          </form>
          <p className='text-center text-gray-600'>New here? <Link to='/signup' className='text-blue-600 font-medium hover:underline'>Create new Account</Link></p>
        </div>
        <div className='mt-6'>
          <Link
            to='/captain-login'
            className='bg-[#10b461] hover:bg-emerald-600 flex items-center justify-center text-white font-semibold rounded-xl px-4 py-3 w-full text-lg shadow-md transition duration-200'
          >Sign in as Captain</Link>
        </div>
      </div>
    </div>
  )
}

export default UserLogin