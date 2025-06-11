import React, { useEffect, useState } from "react";
import "./css/CheckIOTable.css";

type Column = {
  key: string,
  label: string;              
};

interface CheckEditIOTableProps {
  tableTitles: Column[];
  data: Record<string, any>[];
  onRowSelect?: (row: Record<string, any>) => void;
  onDirectionChange?: (idx: number, direction: string) => void;
}

const CheckIOTable: React.FC<CheckEditIOTableProps> = ({ tableTitles, data, onRowSelect, onDirectionChange }) => {
    const [selectedRow, setSelectedRow] = useState<number>(0);
    const [rowDirections, setRowDirections] = useState<string[]>([]);

  useEffect(() => {
    setRowDirections(data.map(() => '입장'));
    if (data.length > 0 && onRowSelect) {
      onRowSelect(data[0]); 
    }
  }, [data]);
  
  const handleRowSelect = (idx: number) => {
    setSelectedRow(idx);
    if (onRowSelect) {
      onRowSelect(data[idx]);
    }
  };

  const handleDirectionChange = (idx: number, direction: string) => {
    const newDirections = [...rowDirections];
    newDirections[idx] = direction;
    setRowDirections(newDirections);

    if (onDirectionChange) {
        onDirectionChange(idx, direction); 
    }
  };

  return (
    <div className="check-io-table-wrapper">
      <table className="check-io-table">
        <thead>
          <tr>
            <th />
            {tableTitles.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            <th>출입 방향</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={tableTitles.length + 2} style={{ textAlign: 'center', padding: '12px', color: '#888' }}>
                조회된 결과가 존재하지 않습니다.
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={idx}
                className={selectedRow === idx ? "check-io-table-selected-row" : ""}
                onClick={() => handleRowSelect(idx)}
                style={{ cursor: 'pointer' }}
              >
                <td>
                  <input
                    type="radio"
                    name="row-selection" 
                    checked={selectedRow === idx}
                    onChange={() => handleRowSelect(idx)}
                  />
                </td>
                {tableTitles.map((col) => (
                  <td
                    key={col.key}
                    className={col.key === "name" ? "check-io-table-name" : ""}
                  >
                    {row[col.key]}
                  </td>
                ))}
                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                  <select
                    value={rowDirections[idx]}
                    onChange={(e) => handleDirectionChange(idx, e.target.value)}
                    style={{ padding: "4px 8px", display: 'inline-block' }}
                  >
                    <option value="입장">입장</option>
                    <option value="퇴장">퇴장</option>
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CheckIOTable;