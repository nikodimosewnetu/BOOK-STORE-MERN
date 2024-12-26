import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Spinner from '../components/Spinner';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineAddBox } from 'react-icons/md';
import BooksTable from '../components/home/BooksTable';
import BooksCard from '../components/home/BooksCard';
const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showType, setShowType] = useState('table');
  const navigate = useNavigate();
  const usernameLocal = localStorage.getItem('token') || sessionStorage.getItem('token');
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  useEffect(() => {
    if (!usernameLocal || !token) {
      navigate('/'); 
    }
  }, [usernameLocal, token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const fetchBooks = async () => {
    if (token) {
      setLoading(true);
      try {
        const response = await axios.get('https://book-store-mern-4.onrender.com/books', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error.message || error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [token]);

  const handleDeleteBook = async (bookId) => {
    try {
      await axios.delete(`https://book-store-mern-4.onrender.com/books/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
     
      setBooks((prevBooks) => prevBooks.filter((book) => book._id !== bookId));
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const toggleView = (viewType) => setShowType(viewType);

  return (
    <div className="p-4">
      <div className="flex justify-center items-center gap-x-4">
        <button
          className="bg-sky-300 hover:bg-sky-600 px-4 py-1 rounded-lg"
          onClick={() => toggleView('table')}
        >
          Table
        </button>
        <button
          className="bg-sky-300 hover:bg-sky-600 px-4 py-1 rounded-lg"
          onClick={() => toggleView('card')}
        >
          Card
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-300 hover:bg-red-600 px-4 py-1 rounded-lg"
        >
          Log out
        </button>
      </div>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl my-8">Books List</h1>
        <Link to="/books/create">
          <MdOutlineAddBox className="text-sky-800 text-4xl" />
        </Link>
      </div>
      {loading ? (
        <Spinner />
      ) : books && books.length > 0 ? (
        showType === 'table' ? (
          <BooksTable books={books} onDelete={handleDeleteBook} />
        ) : (
          <BooksCard books={books} onDelete={handleDeleteBook} />
        )
      ) : (
        <p>No books available.</p>
      )}
    </div>
  );
};

export default Home;
