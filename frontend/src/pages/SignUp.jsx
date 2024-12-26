import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const handleSignUp = async () => {
        if (!username || !email || !password) {
            enqueueSnackbar('All fields are required', { variant: 'warning' });
            return;
        }

        setLoading(true);

        try {
            await axios.post('https://book-store-mern-4.onrender.com/user/signup', { username, email, password });
            enqueueSnackbar('Sign Up successful', { variant: 'success' });
            navigate('/');  
        } catch (error) {
            enqueueSnackbar(error.response?.data?.message || 'Sign up failed', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-6 w-96">
                <h2 className="text-center text-2xl font-semibold mb-4">Sign Up</h2>
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
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter email"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter password"
                    />
                </div>
                <button
                    onClick={handleSignUp}
                    disabled={loading}
                    className={`w-full py-2 text-white rounded-md ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                >
                    {loading ? 'Signing Up...' : 'Sign Up'}
                </button>
                <div className="mt-4 text-center">
                    <p className="text-sm">Already have an account? <Link to="/" className="text-blue-500">Login</Link></p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
