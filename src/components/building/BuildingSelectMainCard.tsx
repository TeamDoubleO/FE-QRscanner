import { useNavigate } from 'react-router-dom'; 
import { useEffect, useState } from "react";

import './css/BuildingSelectMainCard.css';
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

  // const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
    // setIsLoading(true);
      try {
        const data = await fetchBuildingList(currentPage - 1); 
        const transformed = data.content.map((item: any) => ({
          ...item,
          createdDt: item.createdDt
            ? item.createdDt.slice(0, 19).replace("T", " ")
            : "-"
        }));
        setBuildingList(transformed);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error("건물 목록 불러오기 실패:", err);
      } finally {
        // setIsLoading(false);
      }
    };

    loadData();
  }, [currentPage]);

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
