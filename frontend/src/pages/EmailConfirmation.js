import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const EmailConfirmation = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const response = await axios.post('https://book-store-mern-4.onrender.com/user/confirm-email', { token });
        enqueueSnackbar(response.data.message, { variant: 'success' });
        navigate('/'); // Redirect to login after confirmation
      } catch (error) {
        enqueueSnackbar(
          error.response?.data?.message || 'Email confirmation failed. Please try again.',
          { variant: 'error' }
        );
      } finally {
        setLoading(false);
      }
    };

    confirmEmail();
  }, [token, enqueueSnackbar, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Confirming your email...</p>
      </div>
    );
  }

  return null;
};

export default EmailConfirmation;
