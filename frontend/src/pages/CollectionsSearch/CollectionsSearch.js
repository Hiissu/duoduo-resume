import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useEffect, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { CollectionsSearchHeader } from ".";
import { CollectionsResult } from "../../components/Collection";
import { SearchError } from "../../components/Error";
import {
  COLLECTIONS_SEARCH_URL,
  COLLECTIONS_URL,
} from "../../configs/navigators";
import { searchCollections } from "../../store/slices/collectionSlice";

const CollectionsSearch = () => {
  const dispatch = useDispatch();
  const { isLoading, isError } = useSelector((state) => state.collection);

  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get("query");
  const optionParam = searchParams.get("option");
  const topicIdsParam = searchParams.getAll("topicid");
  const pageParam = searchParams.get("page");
  const params2Search = {
    query: queryParam,
    option: optionParam,
    topicid: topicIdsParam,
    page: pageParam,
  };
  const [lastParams, setLastParams] = useState(params2Search);

  const [collections, setCollections] = useState({});
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [numCollections, setNumCollections] = useState(0);

  const set2Success = (response) => {
    setCollections(response.collections);
    setNumPages(response.num_pages);
    setCurrentPage(response.current_page);
    setNumCollections(response.num_collections);
  };

  useEffect(() => {
    const params = `?${createSearchParams(params2Search)}`;
    const response = dispatch(searchCollections({ params }));
    set2Success(response);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  const navigate2SearchNewPage = (params2Search) => {
    navigate({
      pathname: COLLECTIONS_SEARCH_URL,
      search: `?${createSearchParams(params2Search)}`,
    });
  };

  const onChangePage = async (page) => {
    const params2Search = {
      query: queryParam,
      option: optionParam,
      topicid: topicIdsParam,
      page: page,
    };
    navigate2SearchNewPage(params2Search);

    const params = `?${createSearchParams(params2Search)}`;
    const response = dispatch(searchCollections({ params }));
    set2Success(response);
  };

  const navigate = useNavigate();
  const back2Collections = () => navigate(COLLECTIONS_URL);

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

  return (
    <div className="collections">
      <div className="collections-search">
        <h4>
          <span onClick={() => back2Collections()}>
            <BsArrowLeft size={"22px"} className="turn-back-arrow me-2" />
          </span>
          {(numCollections || 0) + ' collections for "' + queryParam + '"'}
        </h4>
        <CollectionsSearchHeader
          params2Search={params2Search}
          lastParams={lastParams}
          setLastParams={setLastParams}
        />
      </div>
      {isError ? (
        <CollectionsResult
          collections={collections}
          numPages={numPages}
          currentPage={currentPage}
          onChangePage={onChangePage}
        />
      ) : (
        <SearchError />
      )}
    </div>
  );
};

export default CollectionsSearch;
