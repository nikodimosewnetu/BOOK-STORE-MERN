import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { useSnackbar } from 'notistack';
import Spinner from "../components/Spinner"

const CreateBooks = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publishYear, setPublishYear] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);  
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const token =  localStorage.getItem('token') || sessionStorage.getItem('token');;


  useEffect(() => {
    if (!token) {
      enqueueSnackbar('Please login first!', { variant: 'error' });
      navigate('/'); 
    }
  }, [token, enqueueSnackbar, navigate]);


  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setImage(selectedFile);
    } else {
      enqueueSnackbar('Please select a valid image file.', { variant: 'error' });
      setImage(null); 
    }
  };

  const validateForm = () => {
    if (!title || !author || !publishYear) {
      enqueueSnackbar('Please fill all required fields: title, author, and publish year.', { variant: 'error' });
      return false;
    }
    if (isNaN(publishYear) || publishYear <= 0) {
      enqueueSnackbar('Please enter a valid publish year.', { variant: 'error' });
      return false;
    }
    return true;
  };


  const handleSaveBook = async () => {
    if (!validateForm()) return;  
    const data = new FormData();
    data.append('title', title);
    data.append('author', author);
    data.append('publishYear', publishYear);
    data.append('image', image);  

    setLoading(true);

    try {
      
      const response = await axios.post('https://book-store-mern-4.onrender.com/books', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('Server Response:', response.data);
      enqueueSnackbar('Book created successfully!', { variant: 'success' });
      resetForm();
      navigate('/home');
    } catch (error) {
  
      if (error.response) {
        enqueueSnackbar(error.response.data.message || 'Failed to create book. Please try again.', { variant: 'error' });
      } else {
        enqueueSnackbar('Network error. Please try again later.', { variant: 'error' });
      }
      console.error('Error creating book:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setAuthor('');
    setPublishYear('');
    setImage(null);
  };

  return (
    <div className="container py-5">
      <BackButton />
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Create New Book</h2>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter book title"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter author's name"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="publishYear" className="block text-sm font-medium text-gray-700">Publish Year</label>
          <input
            type="number"
            id="publishYear"
            value={publishYear}
            onChange={(e) => setPublishYear(e.target.value)}
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter publish year"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">Book Cover Image</label>
          <input
            type="file"
            id="image"
            onChange={handleFileChange}
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleSaveBook}
          disabled={loading}  
        >
          {loading ? (
            <span className="spinner-border spinner-border-sm"><Spinner/></span> 
          ) : (
            'Save Book'
          )}
        </button>
      </div>
    </div>
  );
};

export default CreateBooks;
