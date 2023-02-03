import React from "react";
import { BsSearch } from "react-icons/bs";

const SearchSentencesWill = ({
  querySentenceInWill,
  setQuerySentenceInWill,
}) => {
  const onSearchSentenceInWill = (e) => {
    const query = e.target.value.toLowerCase();
    setQuerySentenceInWill(query);
  };
  return (
    <>
      <label htmlFor="sentences-will" className="label-cap mb-2">
        Sentences in will do
      </label>
      <div className="input-group">
        <input
          type="search"
          className="form-control dark-input"
          id="sentences-will"
          placeholder="Search Sentences"
          autoComplete="off"
          value={querySentenceInWill}
          onChange={(e) => onSearchSentenceInWill(e)}
        />
        <button className="input-group-append btn btn-outline-secondary">
          <BsSearch size={"22px"} />
        </button>
      </div>
    </>
  );
};

export default SearchSentencesWill;
