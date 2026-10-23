import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, getCurrentUser } from '../../services/auth.api';

const Login = () => {
  const navigate = useNavigate();

  // Ekdum simple states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const checkLogged = async () => {
      const data = await getCurrentUser();
      if (data && data._id) {
        navigate('/dashboard', { replace: true });
      }
    };
    checkLogged();
  }, [navigate]);

  const handlesubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Teri api.js wali Login function ko call kar rahe hain
    const success = await login({ email, password });

    setLoading(false);

    if (success) {
      navigate('/dashboard'); // Login ke baad kahan bhejna hai, wo path daal dena
    } else {
      alert('Email ya password galat hai bhai!');
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-semibold text-gray-500 animate-pulse">
          Loading...
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Login
        </h1>
        <form className="space-y-6">
          {}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="email"
            >
              Email:
            </label>
            <input
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none bg-gray-50 focus:bg-white"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="email"
              id="email"
              name="email"
              required
              placeholder="Enter email address"
            />
          </div>

          {}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="password"
            >
              Password:
            </label>
            <input
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none bg-gray-50 focus:bg-white"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
              id="password"
              name="password"
              required
              placeholder="Enter Password"
            />
          </div>

          {}
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg mt-4"
            type="submit"
            onClick={handlesubmit}
          >
            Login
          </button>
        </form>

        {}
        <p className="text-center text-gray-600 mt-8">
          Dont have an account?
          <Link
            className="text-blue-600 hover:text-blue-800 font-semibold ml-2 transition-colors"
            to="/register"
          >
            Register
          </Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
