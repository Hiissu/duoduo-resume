import React from "react";
import { BsExclamationCircleFill } from "react-icons/bs";

const SearchError = () => {
  return (
    <div className="text-center text-danger">
      <BsExclamationCircleFill size={"69px"} className="text-danger" />
      <div className="mt-4">
        Ughhh search engine having issues right now. Come back later.
      </div>
    </div>
  );
};

export default SearchError;
