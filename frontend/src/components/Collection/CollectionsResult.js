import React from "react";
import { Collection } from ".";
import { Paginator } from "../Paginator";
import "./Collection.css";

const CollectionsResult = ({
  collections,
  numPages,
  currentPage,
  onChangePage,
}) => {
  return collections.length > 0 ? (
    collections.map((collection) => (
      <div key={collection.id}>
        <div className="collections-container mt-3">
          <Collection collection={collection} />
        </div>
        <Paginator
          numPages={numPages}
          currentPage={currentPage}
          onChangePage={onChangePage}
        />
      </div>
    ))
  ) : (
    <div className="none-results mt-3">
      <h3>No results found</h3>
      <div>Try searching for something else.</div>
    </div>
  );
};

export default CollectionsResult;
