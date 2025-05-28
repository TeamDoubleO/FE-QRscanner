import { useState } from 'react';
import './css/SearchBar.css';

interface SearchBarProps {
  type: '구역관리' | '사원정보' | '보안그룹';
}

const SearchBar = ({ type }: SearchBarProps) => {
  const dropdownOptions = {
    '구역관리': ['전체', 'A동', 'B동'],
    '사원정보': ['사원이름', '이메일', '직책', '부서명'],
    '보안그룹': ['보안그룹명', '구역 ID', '사원 ID'],
  };

  const placeholder = {
    '구역관리': '검색어를 입력하세요',
    '사원정보': '검색어를 입력하세요',
    '보안그룹': '검색어를 입력하세요',
  };

  const options = dropdownOptions[type];
  const [selected, setSelected] = useState(options[0]);
  const [inputValue, setInputValue] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSearch = () => {
    console.log(`검색: [${selected}] ${inputValue}`);
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
        placeholder={placeholder[type]}
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
