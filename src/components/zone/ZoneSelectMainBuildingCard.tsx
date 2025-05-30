import { useEffect, useRef, useState } from "react";

import './css/ZoneSelectMainBuildingCard.css';
import SearchBar from '../searchbar/SearchBar';
import CheckTable from '../table/CheckTable';
import Pagination from '../table/Pagination';
import LogoutButton from '../buttons/LogoutButton';
import NextButton from "../buttons/NextButton";

import { fetchBuildingList } from '../../apis/areaApi';

const tableTitles = [
  { key: "buildingCode", label: "건물코드" },
  { key: "buildingName", label: "건물명" },
];

interface Props {
  onNext: (buildingId: string) => void;
}

const ZoneSelectMainBuildingCard: React.FC<Props> = ({ onNext }) => {
  const [buildingList, setBuildingList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBuilding, setSelectedBuilding] = useState<Record<string, any> | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  const prevSearchKeywordRef = useRef('');

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
    console.log("선택된 buildingId:", selectedBuilding?.buildingId);
    onNext(selectedBuilding?.buildingId);
  };

  return (
    <div className="zone-select-main-building-card">
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
      <div className="zone-select-main-zone-card-bottom-buttons">
        <LogoutButton />
        <NextButton onClick={handleSelectBuilding} />
      </div>
    </div>
  );
};

export default ZoneSelectMainBuildingCard;
