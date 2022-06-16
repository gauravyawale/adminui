import React, { useState } from "react";
import "./Pagination.css";

const Pagination = ({ userPerPage, totalUser, handlePageNumber }) => {
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const pageNumbers = [];

  //add page number based on the total users available
  for (let page = 1; page <= Math.ceil(totalUser / userPerPage); page++) {
    pageNumbers.push(page);
  }

  return (
    <div>
      <ul style={{ textDecoration: "none" }}>
        <div className="pagination">
          <>
            <div
              className="pagination-display"
              onClick={() => {
                handlePageNumber(1);
                setCurrentPageNumber(1);
              }}
            >
              {"<<"}
            </div>
            <div
              className="pagination-display"
              onClick={() => {
                if (currentPageNumber - 1 > 0) {
                  handlePageNumber(currentPageNumber - 1);
                  setCurrentPageNumber(currentPageNumber - 1);
                }
              }}
            >
              {"<"}
            </div>
          </>
          <>
            {pageNumbers.map((number) => (
              <div
                key={number}
                className={
                  currentPageNumber === number
                    ? "pagination-display-selected"
                    : "pagination-display mobile-page"
                }
                onClick={() => {
                  handlePageNumber(number);
                  setCurrentPageNumber(number);
                }}
              >
                {number}
              </div>
            ))}
          </>
          <>
            <div
              className="pagination-display"
              onClick={() => {
                if (currentPageNumber + 1 <= pageNumbers.length) {
                  handlePageNumber(currentPageNumber + 1);
                  setCurrentPageNumber(currentPageNumber + 1);
                }
              }}
            >
              {">"}
            </div>
            <div
              className="pagination-display"
              onClick={() => {
                handlePageNumber(pageNumbers[pageNumbers.length - 1]);
                setCurrentPageNumber(pageNumbers[pageNumbers.length - 1]);
              }}
            >
              {">>"}
            </div>
          </>
        </div>
      </ul>
    </div>
  );
};

export default Pagination;
