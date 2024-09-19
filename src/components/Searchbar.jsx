import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for a product..."
        className="border p-2 rounded w-full text-black bg-white"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-2">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
