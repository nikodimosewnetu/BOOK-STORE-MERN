import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EmailConfirmation = () => {
  const { token } = useParams(); // Get token from URL
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const response = await axios.post(`http://localhost:5555/user/confirm-email/${token}`);
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
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h1>Email Confirmation</h1>
          <p>{message}</p>
          <button onClick={() => navigate('/login')}>Go to Login</button>
        </div>
      )}
    </div>
  );
};

export default EmailConfirmation;
