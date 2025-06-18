import { useState } from 'react';
import { supabase } from './supabaseClient';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signIn = async (event) => {
    event.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      setPassword(''); 
    } else {
      toast.success('Login successful!');
      onLogin(data.user);
    }
  };

  return (
    <div className="min-h-screen bg-[url('/office3.jpg')] bg-cover bg-center flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/20 backdrop-blur bg-opacity-90 p-8 rounded-lg shadow-lg">
        <img src="/rfr.png" alt="rfr" className="h-[200px] mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-center text-blue-500 mb-6">
          RFR PROFESSIONALS LEAVE MANAGEMENT
        </h1>
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Login</h2>
        <form>
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
            onClick={signIn}
            disabled={loading}
            className={`w-full py-2 rounded text-white ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            } transition`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}









