import { useState } from 'react';
import './css/SearchBar.css';

interface SearchBarProps {             
  placeholder?: string;           
  onSearch?: (input: string) => void;
}

const SearchBar = ({ placeholder, onSearch }: SearchBarProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleSearch = () => {
    console.log(`검색: ${inputValue}`);
    if (onSearch) onSearch(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-bar-input"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button className="search-bar-button" onClick={handleSearch}>
        검색
      </button>
    </div>
  );
};

export default SearchBar;
