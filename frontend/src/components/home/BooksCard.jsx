import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineDelete } from 'react-icons/md';

const BooksCard = ({ books, onDelete }) => {
  const handleDeleteClick = (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      onDelete(bookId);
    }
  };

  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {books.map((item) => (
        <div key={item._id} className="relative group">
          <div className="p-6 border rounded-lg shadow-lg bg-white hover:shadow-2xl transition-shadow duration-300 ease-in-out w-full max-w-xs sm:max-w-sm lg:max-w-md xl:max-w-lg">
            <div className="mb-4">
              <h3 className="text-2xl font-semibold text-gray-800">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.author}</p>
            </div>
            <div className="absolute top-4 right-4 flex gap-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Link to={`/books/details/${item._id}`}>
                <BsInfoCircle className="text-2xl text-green-600 hover:text-green-800" />
              </Link>
              <Link to={`/books/edit/${item._id}`}>
                <AiOutlineEdit className="text-2xl text-yellow-500 hover:text-yellow-700" />
              </Link>
              <button
                onClick={() => handleDeleteClick(item._id)}
                className="text-2xl text-red-600 hover:text-red-800"
              >
                <MdOutlineDelete />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BooksCard;
