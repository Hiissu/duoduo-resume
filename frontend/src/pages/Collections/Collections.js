import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSearchParams, useNavigate } from "react-router-dom";
import { SearchHeader } from ".";
import { CollectionsResult } from "../../components/Collection";
import { SearchError } from "../../components/Error";
import { COLLECTIONS_URL } from "../../configs/navigators";
import { getCollections } from "../../store/slices/collectionSlice";
import "./Collections.css";

const Collections = () => {
  const dispatch = useDispatch();
  const { isLoading, isError } = useSelector((state) => state.collection);

  const [collections, setCollections] = useState([]);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const setResponse = (response) => {
    setCollections(response.collections);
    setNumPages(response.num_pages);
    setCurrentPage(response.current_page);
  };
  useEffect(() => {
    const params = `?${createSearchParams({ page: 1 })}`;

    (async () => {
      const response = await dispatch(getCollections({ params }));
      console.log("res from getCollections", response);

      setResponse(response.payload);
    })();
  }, [dispatch]);

  const navigate = useNavigate();
  const navigate2NewPage = (page) => {
    const newParams = { page };
    navigate({
      pathname: COLLECTIONS_URL,
      search: `?${createSearchParams(newParams)}`,
    });
  };

  const onChangePage = (page) => {
    navigate2NewPage(page);
    const params = `?${createSearchParams({
      page,
    })}`;

    const response = dispatch(getCollections({ params }));
    setResponse(response);
  };

  if (isLoading)
    return (
      <Backdrop
        sx={{
          color: "#000000",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  else if (isError) return <SearchError />;

  return (
    <div className="collections">
      <div className="collections-search">
        <SearchHeader />
      </div>
      <CollectionsResult
        collections={collections}
        numPages={numPages}
        currentPage={currentPage}
        onChangePage={onChangePage}
      />
    </div>
  );
};

export default Collections;
