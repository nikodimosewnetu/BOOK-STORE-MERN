import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleLogin = async () => {
    if (!username || !password) {
      enqueueSnackbar('Username and password are required', { variant: 'warning' });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('https://book-store-mern-4.onrender.com/user/login', { username, password });

      const { token, username: loggedInUsername, emailConfirmed } = response.data;

      if (!emailConfirmed) {
        enqueueSnackbar('Please confirm your email before logging in.', { variant: 'warning' });
        return;
      }

      if (!token) {
        enqueueSnackbar('Token not received from server', { variant: 'error' });
        return;
      }

      if (rememberMe) {
        localStorage.setItem('token', token);
      } else {
        sessionStorage.setItem('token', token);
      }
      localStorage.setItem('user', loggedInUsername);

      enqueueSnackbar('Login successful', { variant: 'success' });

      setUsername('');
      setPassword('');

      navigate('/home');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      enqueueSnackbar(errorMessage, { variant: 'error' });
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96">
        <h2 className="text-center text-2xl font-semibold mb-4">Login</h2>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Enter username"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
            />
          </div>
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
            className="mr-2"
          />
          <label htmlFor="rememberMe" className="text-sm">Remember Me</label>
        </div>
        <button
          className={`w-full py-2 text-white rounded-md ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <div className="mt-4 text-center">
          <p className="text-sm">Don't have an account? <Link to="/signup" className="text-blue-500">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
