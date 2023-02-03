import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Collection } from ".";
import { COLLECTIONS_URL } from "../../configs/navigators";
import { getCollectionsLearning } from "../../store/slices/collectionSlice";

const CollectionsLearning = () => {
  const dispatch = useDispatch();
  const { collectionsLearning, isLoading, isError } = useSelector(
    (state) => state.collection
  );

  useEffect(() => {
    if (collectionsLearning === null) dispatch(getCollectionsLearning());
  }, [collectionsLearning, dispatch]);

  const LearningNone = () => {
    return (
      <div className="none-results">
        <h3>No collections learning</h3>
        <div>
          <Link to={COLLECTIONS_URL} className="me-2">
            Find new collections
          </Link>
          or create your own collection.
        </div>
      </div>
    );
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
  else if (isError) return <LearningNone />;

  return (
    <div className="collections-container mt-3">
      {collectionsLearning &&
        collectionsLearning.length > 0 &&
        collectionsLearning.map((collection) => (
          <Collection key={collection.id} collection={collection} />
        ))}
    </div>
  );
};

export default CollectionsLearning;
