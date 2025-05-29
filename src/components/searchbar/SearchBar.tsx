import { useState } from 'react';
import './css/SearchBar.css';

interface SearchBarProps {
  options: string[];               
  placeholder?: string;           
  onSearch?: (selected: string, input: string) => void;
}

const SearchBar = ({ options, placeholder = '검색어를 입력하세요', onSearch }: SearchBarProps) => {
  const [selected, setSelected] = useState(() => options?.[0] ?? '');
  const [inputValue, setInputValue] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSearch = () => {
    console.log(`검색: [${selected}] ${inputValue}`);
    if (onSearch) onSearch(selected, inputValue);
  };

  return (
    <div className="search-bar">
      <div className="search-bar-dropdown">
        <button className="search-bar-dropdown-toggle" onClick={() => setDropdownOpen(!dropdownOpen)}>
          {selected} <span className="search-bar-arrow">▼</span>
        </button>
        {dropdownOpen && (
          <ul className="search-bar-dropdown-menu">
            {options.map((opt) => (
              <li key={opt} onClick={() => { setSelected(opt); setDropdownOpen(false); }}>
                {opt}
              </li>
            ))}
          </ul>
        )}
      </div>
      <input
        type="text"
        className="search-bar-input"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button className="search-bar-button" onClick={handleSearch}>
        검색
      </button>
    </div>
  );
};

export default SearchBar;
