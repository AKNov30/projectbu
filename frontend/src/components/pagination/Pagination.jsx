// src/components/Pagination.jsx
import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages === 0) return null;

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination justify-content-center mt-2">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button
            className="page-link btn btn-primary"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ก่อนหน้า
          </button>
        </li>
        {Array.from({ length: totalPages }, (_, index) => (
          <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
            <button
              className="page-link btn btn-outline-primary"
              onClick={() => onPageChange(index + 1)}
            >
              {index + 1}
            </button>
          </li>
        ))}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button
            className="page-link btn btn-primary"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            ถัดไป
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
