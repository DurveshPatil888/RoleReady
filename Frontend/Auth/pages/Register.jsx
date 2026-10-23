import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';

const Register = () => {
  const { loading, handleRegister } = useAuth();
  const navigate = useNavigate();

  // Teeno fields ke liye alag alag state (simple aur clean)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handlesubmit = async (e) => {
    e.preventDefault();
    const success = await handleRegister({ name, email, password });
    if (success) {
      navigate('/login'); // Register hone ke baad login par bhej do
    }
  };

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <h1 className="text-xl font-semibold text-gray-700">Loading...</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Register</h1>
          <p className="text-gray-500 mt-2">
            Create your account to get started
          </p>
        </div>

        <form className="space-y-5" onSubmit={handlesubmit}>
          {/* Name Input */}
          {}
          <div className="flex flex-col space-y-1">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Name:
            </label>
            <input
              onChange={(e) => {
                setName(e.target.value);
              }}
              type="text"
              id="name"
              name="name"
              required
              placeholder="Enter full name"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>

          {/* Email Input */}
          {}
          <div className="flex flex-col space-y-1">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email:
            </label>
            <input
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="email"
              id="email"
              name="email"
              required
              placeholder="Enter email address"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>

          {/* Password Input */}
          {}
          <div className="flex flex-col space-y-1">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password:
            </label>
            <input
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
              id="password"
              name="password"
              required
              placeholder="Enter Password"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>

          {}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all active:scale-95"
          >
            Register
          </button>
        </form>

        {}
        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Register;
