import "./Paginator.css";
import React, { useEffect, useState } from "react";

const Paginator = ({ numPages, currentPage, onChangePage }) => {
  const totalPages = numPages;

  const [pager, setPager] = useState({});
  const getPager = () => {
    let startPage, endPage;
    if (totalPages <= 10) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 10 total pages so calculate start and end pages
      if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        // more than 7
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }

    // create an array of pages to ng-repeat in the pager control
    const pages = [...Array(endPage + 1 - startPage).keys()].map(
      (i) => startPage + i
    );

    // return object with all pager properties required by the view
    return {
      startPage: startPage,
      endPage: endPage,
      pages: pages,
    };
  };

  useEffect(() => {
    setPager(getPager());
  }, [numPages, currentPage]);

  const onChangePagee = (page) => {
    if (page !== currentPage) onChangePage(page);
  };

  if (currentPage < 1 || currentPage > totalPages) return "";
  else if (!pager.pages || pager.pages.length <= 1) return ""; // don't display pager if there is only 1 page

  return (
    <ul className="pagination justify-content-center">
      {currentPage > 1 && (
        <>
          <li className="page-item" onClick={() => onChangePagee(1)}>
            First
          </li>
          <li
            className="page-item"
            onClick={() => onChangePagee(currentPage - 1)}
          >
            Previous
          </li>
        </>
      )}
      {pager.pages.map((page, index) => (
        <li
          key={index}
          className={page === currentPage ? "page-item-active" : "page-item"}
          onClick={() => onChangePagee(page)}
        >
          {page}
        </li>
      ))}
      {currentPage < totalPages && (
        <>
          <li
            className="page-item"
            onClick={() => onChangePagee(currentPage + 1)}
          >
            Next
          </li>
          <li className="page-item" onClick={() => onChangePagee(totalPages)}>
            Last
          </li>
        </>
      )}
    </ul>
  );
};

export default Paginator;
