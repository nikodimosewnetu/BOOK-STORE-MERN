import React, { useState, useEffect } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const DeleteBook = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  
  useEffect(() => {
    if (!token) {
      enqueueSnackbar('Please log in to delete a book', { variant: 'error' });
      navigate('/login');
    }
  }, [token, navigate, enqueueSnackbar]);

  const handleDeleteBook = async () => {
    if (!token) {
      enqueueSnackbar('Authentication failed! Please log in again.', { variant: 'error' });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.delete(`https://book-store-mern-4.onrender.com/books/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      
      enqueueSnackbar('Book deleted successfully', { variant: 'success' });
      navigate('/home');
    } catch (error) {
    
      setLoading(false);
      const errorMessage = error.response?.data?.message || 'An error occurred while deleting the book.';
      enqueueSnackbar(errorMessage, { variant: 'error' });
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <BackButton />
      <h1 className="text-3xl my-4 text-center">Delete Book</h1>

      {loading && <Spinner />}

      <div className="flex flex-col items-center border-2 border-sky-400 rounded-xl w-[600px] p-8 mx-auto shadow-md">
        <h3 className="text-2xl mb-4 text-gray-800">Are you sure you want to delete this book?</h3>

        <div className="flex justify-center gap-4">
          <button
            className="p-4 bg-red-600 text-white rounded-lg w-32 hover:bg-red-700 transition"
            onClick={handleDeleteBook}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Yes, Delete it'}
          </button>
          <button
            className="p-4 bg-gray-300 text-black rounded-lg w-32 hover:bg-gray-400 transition"
            onClick={() => navigate('/home')}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBook;
