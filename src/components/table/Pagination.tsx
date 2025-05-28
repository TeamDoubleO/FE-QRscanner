import React from "react";
import "./css/Pagination.css";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

    const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const maxVisiblePages = 5;

    const currentGroup = Math.floor((currentPage - 1) / maxVisiblePages);

    const startPage = currentGroup * maxVisiblePages + 1;
    const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    const hasPrevGroup = startPage > 1;
    const hasNextGroup = endPage < totalPages;

    return (
        <div className="pagination-wrapper">
        <button
            className="pagination-arrow"
            disabled={!hasPrevGroup}
            onClick={() => onPageChange(startPage - maxVisiblePages)}  
        >
            <FiChevronLeft />
        </button>
        {pages.map((page) => (
            <button
            key={page}
            className={`pagination-button ${currentPage === page ? "active" : ""}`}
            onClick={() => onPageChange(page)}
            >
            {page}
            </button>
        ))}
        <button
            className="pagination-arrow"
            disabled={!hasNextGroup}
            onClick={() => onPageChange(startPage + maxVisiblePages)}  
        >
            <FiChevronRight />
        </button>
        </div>
    );
};

export default Pagination;