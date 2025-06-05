import React, { useEffect, useState } from "react";
import "./css/CheckTable.css";

type Column = {
  key: string,
  label: string;              
};

interface CheckEditTableProps {
  tableTitles: Column[];
  data: Record<string, any>[];
  onRowSelect?: (row: Record<string, any>) => void;
}

const CheckTable: React.FC<CheckEditTableProps> = ({ tableTitles, data, onRowSelect }) => {
    const [selectedRow, setSelectedRow] = useState<number>(0);

    useEffect(() => {
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

  return (
    <div className="check-table-wrapper">
      <table className="check-table">
        <thead>
          <tr>
            <th />
            {tableTitles.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            <th></th>
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
                className={selectedRow === idx ? "check-table-selected-row" : ""}
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
                    className={col.key === "name" ? "check-table-name" : ""}
                  >
                    {row[col.key]}
                  </td>
                ))}
                <td></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CheckTable;