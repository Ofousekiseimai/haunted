import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setQuery('');
      // Call the onSearch callback if provided
      if (onSearch) onSearch();
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto mt-4 lg:mt-0">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Αναζήτηση άρθρων..."
          className="w-full px-4 py-2 rounded-lg bg-n-6 text-white placeholder-n-3 focus:outline-none focus:ring-2 focus:ring-color-1"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="absolute right-3 top-2.5">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default SearchBar;