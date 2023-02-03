import React from "react";
import { BsSearch } from "react-icons/bs";

const SearchPhrasesWill = ({ queryPhraseInWill, setQueryPhraseInWill }) => {
  const onSearchPhraseInWill = (e) => {
    const query = e.target.value.toLowerCase();
    setQueryPhraseInWill(query);
  };
  return (
    <>
      <label htmlFor="phrases-will" className="label-cap mb-2">
        Phrases in will do
      </label>
      <div className="input-group">
        <input
          type="search"
          className="form-control dark-input"
          id="phrases-will"
          placeholder="Search Phrases"
          autoComplete="off"
          value={queryPhraseInWill}
          onChange={(e) => onSearchPhraseInWill(e)}
        />
        <button className="input-group-append btn btn-outline-secondary">
          <BsSearch size={"22px"} />
        </button>
      </div>
    </>
  );
};

export default SearchPhrasesWill;
