import { useEffect, useRef, useState } from "react";

import './css/ZoneSelectMainBuildingCard.css';
import '../loading/css/Loading.css';
import SearchBar from '../searchbar/SearchBar';
import CheckTable from '../table/CheckTable';
import Pagination from '../table/Pagination';
import LogoutButton from '../buttons/LogoutButton';
import NextButton from "../buttons/NextButton";
import Loading from '../loading/Loading';

import { fetchBuildingList } from '../../apis/areaApi';

const tableTitles = [
  { key: "buildingCode", label: "건물코드" },
  { key: "buildingName", label: "건물명" },
];

interface Props {
  onNext: (buildingId: string, buildingName: string) => void;
}

const ZoneSelectMainBuildingCard: React.FC<Props> = ({ onNext }) => {
  const [buildingList, setBuildingList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBuilding, setSelectedBuilding] = useState<Record<string, any> | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const prevSearchKeywordRef = useRef('');

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

    const { buildingId, buildingName } = selectedBuilding;

    localStorage.setItem("buildingName", buildingName);
    onNext(buildingId, buildingName);
  };

  return (
    <div className="zone-select-main-building-card">
      {isLoading ? (
          <div className="loading-overlay">
            <Loading />
            <div className="loading-text">건물 정보를 불러오는 중입니다...</div>
          </div>
        ) : (
      <div className="zone-select-main-building-card-table-wrapper">
        <h2>건물 선택</h2>
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
      )}
      <div className="zone-select-main-zone-card-bottom-buttons">
        <LogoutButton />
        <NextButton onClick={handleSelectBuilding} />
      </div>
    </div>
  );
};

export default ZoneSelectMainBuildingCard;
