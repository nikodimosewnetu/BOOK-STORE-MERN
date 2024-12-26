import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';

const ShowBook = () => {
  const [book, setBook] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios
    .get(`https://book-store-mern-4.onrender.com/books/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')|| sessionStorage.getItem('token')}`, 
      },
    })
    .then((response) => {
      setBook(response.data);
      setLoading(false);
    })
    .catch((error) => {
      console.log(error);
      setLoading(false);
    });
  
  }, [id]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <BackButton />
      <h1 className="text-3xl font-semibold my-6 text-center text-gray-800">Book Details</h1>
      
      {loading ? (
        <div className="flex justify-center items-center">
          <Spinner />
        </div>
      ) : (
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg border border-gray-300">
          <div className="mb-6">
            {book.image && (
              <img 
                src={book.image} 
                alt="Book cover" 
                className="w-full h-64 object-cover rounded-md shadow-md mb-4" 
              />
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-lg font-medium text-gray-600 w-36">Id:</span>
              <span className="text-gray-800">{book._id}</span>
            </div>

            <div className="flex items-center">
              <span className="text-lg font-medium text-gray-600 w-36">Title:</span>
              <span className="text-gray-800">{book.title}</span>
            </div>

            <div className="flex items-center">
              <span className="text-lg font-medium text-gray-600 w-36">Author:</span>
              <span className="text-gray-800">{book.author}</span>
            </div>

            <div className="flex items-center">
              <span className="text-lg font-medium text-gray-600 w-36">Publish Year:</span>
              <span className="text-gray-800">{book.publishYear}</span>
            </div>

            <div className="flex items-center">
              <span className="text-lg font-medium text-gray-600 w-36">Create Time:</span>
              <span className="text-gray-800">{new Date(book.createdAt).toLocaleString()}</span>
            </div>

            <div className="flex items-center">
              <span className="text-lg font-medium text-gray-600 w-36">Last Update:</span>
              <span className="text-gray-800">{new Date(book.updatedAt).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowBook;
