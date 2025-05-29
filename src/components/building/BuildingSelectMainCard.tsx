import { useNavigate } from 'react-router-dom'; 
import { useEffect, useRef, useState } from "react";

import './css/BuildingSelectMainCard.css';
import SearchBar from '../searchbar/SearchBar';
import CheckTable from '../table/CheckTable';
import Pagination from '../table/Pagination';
import LogoutButton from '../buttons/LogoutButton';
import SelectButton from '../buttons/SelectButton';

import { adminLogout } from '../../apis/loginApi';
import { fetchBuildingList } from '../../apis/areaApi';

const tableTitles = [
  { key: "buildingCode", label: "건물코드" },
  { key: "buildingName", label: "건물명" },
];

const BuildingSelectMainCard: React.FC = () => {
  const [buildingList, setBuildingList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBuilding, setSelectedBuilding] = useState<Record<string, any> | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  const prevSearchKeywordRef = useRef('');

  // const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const loadPage = async (page: number, keyword: string) => {
    try {
      const data = await fetchBuildingList(page - 1, keyword);
      setBuildingList(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("건물 목록 불러오기 실패:", err);
    }
  };

  const handleSearch = async (input: string) => {
    const trimmed = input.trim();

    if (trimmed !== prevSearchKeywordRef.current || currentPage !== 1) {
      prevSearchKeywordRef.current = trimmed;
      setSearchKeyword(trimmed);

      if (currentPage === 1) {
        await loadPage(1, trimmed); 
      } else {
        setCurrentPage(1);
      }
    }
  };

  useEffect(() => {
    loadPage(currentPage, searchKeyword);
  }, [currentPage, searchKeyword ?? '']);

  const handleSelectBuilding = () => {
    localStorage.setItem("deviceAreaCode", selectedBuilding?.buildingCode);
    navigate("/qr"); 
  };

  const handleLogout = async () => {
    const confirmed = window.confirm("로그아웃 하시겠습니까?");
    if (!confirmed) return;

    try {
      await adminLogout();
      localStorage.clear();
      navigate("/login");
    } catch (err: any) {
      localStorage.clear();
      const message = err?.message ?? "로그아웃 실패";
      alert(message); 
      console.warn("관리자 로그아웃 실패:", err);
      navigate("/login");
    }
  };

  return (
    <div className="building-select-main-card">
      <div className="building-select-main-card-table-wrapper">
      <h2>건물 출입구 선택</h2>
      <br />
      <SearchBar
        placeholder="건물명을 입력하세요"
        onSearch={handleSearch}
      />
      <br />
      <CheckTable 
        tableTitles={tableTitles} 
        data={buildingList}
        onRowSelect={(row) => setSelectedBuilding(row)} 
      />
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages} 
        onPageChange={setCurrentPage}
      />
      </div>
      <div className="building-select-main-card-bottom-buttons">
        <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
        <SelectButton onClick={handleSelectBuilding}>해당 건물 QR스캔 시작</SelectButton>
      </div>
    </div>
  );
};

export default BuildingSelectMainCard;
