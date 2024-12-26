import { Link } from 'react-router-dom';
import { PiBookOpenTextLight } from 'react-icons/pi';
import { BiUserCircle } from 'react-icons/bi';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineDelete } from 'react-icons/md';

const BookSingleCard = ({ book, onDelete }) => {
  return (
    <div className="border border-gray-300 rounded-lg p-6 shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <h3 className="text-2xl font-semibold text-gray-800 mb-3">{book.title}</h3>
      <p className="text-lg text-gray-700 mb-2">
        <BiUserCircle className="inline-block mr-2 text-gray-600" />
        {book.author}
      </p>
      <p className="text-lg text-gray-700 mb-4">
        <PiBookOpenTextLight className="inline-block mr-2 text-gray-600" />
        Publish Year: {book.publishYear}
      </p>
      <div className="flex justify-end gap-4">
        <Link
          to={`/books/details/${book._id}`}
          className="text-2xl text-green-600 hover:text-green-800 transition-colors duration-200"
        >
          <BsInfoCircle />
        </Link>
        <Link
          to={`/books/edit/${book._id}`}
          className="text-2xl text-yellow-500 hover:text-yellow-700 transition-colors duration-200"
        >
          <AiOutlineEdit />
        </Link>
        <button
          onClick={() => onDelete(book._id)}
          className="text-2xl text-red-600 hover:text-red-800 transition-colors duration-200"
        >
          <MdOutlineDelete />
        </button>
      </div>
    </div>
  );
};

export default BookSingleCard;
