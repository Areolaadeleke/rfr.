import { useState } from 'react'
import { supabase } from './supabaseClient'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from './Loader';
import Header from './Header';

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    console.log('Logging in with:', { email, password }); 
    setLoading(true)   // start loader

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (authError) {
      setLoading(false)  // stop loader
      alert('Login failed: ' + authError.message)
      return
    }

    const user = authData.user

    // Fetch role from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      setLoading(false)  // stop loader
      alert('No profile found. Contact Admin.')
      return
    }

    setLoading(false)  // stop loader on success


    // Redirect based on role
    switch (profile.role) {
      case 'admin':
        navigate('/admin')
        break
      case 'staff':
        navigate('/staff')
        break
      case 'hr':
        navigate('/linemanager')
        break
      default:
        alert('Unknown role. Contact admin.')
    }
  }

  return (

<>
    <Header />
    <div className="min-h-screen bg-[url('/office3.jpg')] bg-cover bg-center flex items-center justify-center px-4">
      
      <div className="w-full max-w-md bg-white/20 backdrop-blur bg-opacity-90 p-8 rounded-lg shadow-lg">
        <img src="/rfr.png" alt="rfr" className="h-[200px] mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-center text-blue-500 mb-6">
          RFR PROFESSIONALS Portal Hub
        </h1>
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6"> Please Login</h2>
        <form onSubmit={handleLogin}>
          {loading ? ( 
             <div className="flex justify-center items-center py-4">
                  <svg
                    className="animate-spin h-8 w-8 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                </div>
           ) :(
              <>
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 mb-6"
          />

          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 mb-6"
          />

          <button
            type='submit'
            disabled={loading}
            className={`w-full py-2 rounded text-white ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            } transition`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
              </>  )}
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  </>
  )
}