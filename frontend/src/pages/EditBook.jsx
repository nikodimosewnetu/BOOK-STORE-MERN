import React, { useState, useEffect } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const EditBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publishYear, setPublishYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

 
  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://book-store-mern-4.onrender.com/books/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        setTitle(response.data.title);
        setAuthor(response.data.author);
        setPublishYear(response.data.publishYear);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setError(error.response ? error.response.data.message : 'Failed to fetch book details');
        enqueueSnackbar('Failed to fetch book details', { variant: 'error' });
      });
  }, [id, enqueueSnackbar]);


  const handleEditBook = () => {
    if (!title || !author || !publishYear) {
      enqueueSnackbar('All fields are required!', { variant: 'warning' });
      return;
    }

    const data = { title, author, publishYear };

    setLoading(true);
    axios
      .put(
        `https://book-store-mern-4.onrender.com/books/${id}`,
        data,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
          },
        }
      )
      .then((response) => {
        setLoading(false);
        enqueueSnackbar('Book updated successfully', { variant: 'success' });
        navigate('/home');
      })
      .catch((error) => {
        setLoading(false);
        setError(error.response ? error.response.data.message : 'Failed to edit book');
        enqueueSnackbar('Failed to edit book. Please try again.', { variant: 'error' });
      });
  };

  return (
    <div className='p-4'>
      <BackButton />
      <h1 className='text-3xl my-4'>Edit Book</h1>
      {loading && <Spinner />}
      {error && <div className='text-red-500 my-2'>{error}</div>} 
      <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Title</label>
          <input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
            disabled={loading}
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Author</label>
          <input
            type='text'
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
            disabled={loading}
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Publish Year</label>
          <input
            type='number'
            value={publishYear}
            onChange={(e) => setPublishYear(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
            disabled={loading}
          />
        </div>
        <button
          className={`p-2 m-8 ${loading ? 'bg-gray-400' : 'bg-sky-300 hover:bg-sky-600'}`}
          onClick={handleEditBook}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default EditBook;
