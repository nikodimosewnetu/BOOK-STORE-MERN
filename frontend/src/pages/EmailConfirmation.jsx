import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EmailConfirmation = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  let token;
  useEffect(() => {
    const confirmEmail = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      token = queryParams.get('token');
      try {
        const response = await axios.post(`https://book-store-mern-4.onrender.com/user/confirm-email/?token=${token}`);
        setMessage(response.data.message);
        setLoading(false);
      } catch (error) {
        setMessage('There was an error confirming your email.');
        setLoading(false);
      }
    };

    confirmEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-xl font-semibold text-gray-700">Loading...</p>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Email Confirmation</h1>
            <p className="text-lg text-gray-600 mb-6">{message}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-300"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailConfirmation;
