import { useNavigate } from 'react-router-dom'; 
import { useEffect, useRef, useState } from "react";

import './css/BuildingSelectMainCard.css';
import '../loading/css/Loading.css';
import SearchBar from '../searchbar/SearchBar';
import CheckIOTable from '../table/CheckIOTable';
import Pagination from '../table/Pagination';
import LogoutButton from '../buttons/LogoutButton';
import SelectButton from '../buttons/SelectButton';
import Loading from '../loading/Loading';

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
  const [selectedDirection, setSelectedDirection] = useState<string>('입장');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const prevSearchKeywordRef = useRef('');
  const navigate = useNavigate();

  const loadPage = async (page: number, keyword: string) => {
    setIsLoading(true)
    try {
      const data = await fetchBuildingList(page - 1, keyword);
      setBuildingList(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("건물 목록 불러오기 실패:", err);
    } finally {
      setIsLoading(false)
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
  }, [currentPage, searchKeyword]);

  const handleSelectBuilding = () => {
    if (!selectedBuilding) return;

    const { buildingId, buildingCode, buildingName } = selectedBuilding;

    localStorage.setItem("deviceLocationType", "BUILDING");
    localStorage.setItem("deviceAreaId", buildingId);
    localStorage.setItem("deviceAreaCode", buildingCode);
    localStorage.setItem("buildingName", buildingName);

    const directionValue = selectedDirection === '입장' ? 'IN' : 'OUT';
    localStorage.setItem("direction", directionValue);

    navigate("/qr"); 
  };

  return (
    <div className="building-select-main-card">
      {isLoading ? (
          <div className="loading-overlay">
            <Loading />
            <div className="loading-text">건물 정보를 불러오는 중입니다...</div>
          </div>
        ) : (
      <div className="building-select-main-card-table-wrapper">
        <h2>건물 출입구 선택</h2>
        <br />
        <SearchBar
          placeholder="건물명을 입력하세요"
          onSearch={handleSearch}
        />
        <br />
        <CheckIOTable 
          tableTitles={tableTitles} 
          data={buildingList}
          onRowSelect={(row) => setSelectedBuilding(row)} 
          onDirectionChange={(idx, direction) => {
            if (buildingList[idx] === selectedBuilding) {
              setSelectedDirection(direction);
            }
          }}
        />
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages} 
          onPageChange={setCurrentPage}
        />
      </div>
      )}
      <div className="building-select-main-card-bottom-buttons">
        <LogoutButton />
        <SelectButton onClick={handleSelectBuilding}>해당 건물 QR스캔 시작</SelectButton>
      </div>
    </div>
  );
};

export default BuildingSelectMainCard;
