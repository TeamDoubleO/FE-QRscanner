import { useNavigate } from 'react-router-dom'; 
import { useEffect, useRef, useState } from "react";

import SearchBar from '../searchbar/SearchBar';
import CheckTable from '../table/CheckTable';
import Pagination from '../table/Pagination';
import LogoutButton from '../buttons/LogoutButton';
import BackButton from '../buttons/BackButton';
import SelectButton from '../buttons/SelectButton';
import Loading from '../loading/Loading';

import './css/ZoneSelectMainZoneCard.css';
import '../loading/css/Loading.css';

import { fetchZoneList } from '../../apis/areaApi';

const tableTitles = [
  { key: "areaCode", label: "구역코드" },
  { key: "areaName", label: "구역명" },
];

interface Props {
  buildingId: string;
  buildingName: string;
  onBack: () => void;
}

const ZoneSelectMainZoneCard: React.FC<Props> = ({ buildingId, buildingName, onBack }) => {
  const [buildingList, setBuildingList] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedZone, setSelectedZone] = useState<Record<string, any> | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const prevSearchKeywordRef = useRef('');
  const navigate = useNavigate();
  
  const loadPage = async (buildingId: string, page: number, keyword: string) => {
    setIsLoading(true)
    if (!buildingId) return;
    try {
      const data = await fetchZoneList(buildingId, page - 1, keyword);
      setBuildingList(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("구역 목록 불러오기 실패:", err);
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
        await loadPage(buildingId, 1, trimmed); 
      } else {
        setCurrentPage(1);
      }
    }
  };
  
  useEffect(() => {
    loadPage(buildingId, currentPage, searchKeyword);
  }, [buildingId, currentPage, searchKeyword]);
  
  const handleSelectZone = () => {
    if (!selectedZone) return;

    const { areaCode, areaName, areaId } = selectedZone;

    localStorage.setItem("deviceLocationType", "AREA");
    localStorage.setItem("deviceAreaId", areaId);
    localStorage.setItem("deviceAreaCode", areaCode);
    localStorage.setItem("zoneName", areaName);
    localStorage.setItem("buildingName", buildingName);
    navigate("/qr", { replace: false }); 
  };

  return (
    <div className="building-select-main-card">
      {isLoading ? (
          <div className="loading-overlay">
            <Loading />
            <div className="loading-text">구역 정보를 불러오는 중입니다...</div>
          </div>
        ) : (
      <>
      <BackButton onClick={onBack} />
      <div className="building-select-main-card-table-wrapper">
        <h2>구역 출입구 선택</h2>
        <br />
        <SearchBar
          placeholder="구역명을 입력하세요"
          onSearch={handleSearch}
        />
        <br />
        <CheckTable 
          tableTitles={tableTitles} 
          data={buildingList}
          onRowSelect={(row) => setSelectedZone(row)} 
        />
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages} 
          onPageChange={setCurrentPage}
        />
      </div>
      </>
      )}
      <div className="building-select-main-card-bottom-buttons">
        <LogoutButton />
        <SelectButton onClick={handleSelectZone}>해당 구역 QR스캔 시작</SelectButton>
      </div>
    </div>
  );
};

export default ZoneSelectMainZoneCard;
