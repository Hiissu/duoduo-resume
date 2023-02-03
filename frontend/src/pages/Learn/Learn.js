import "./Learn.css";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Scrollup } from "../../components/Scrollup";
import { CollectionCreateModal } from "../../components/CollectionModal";
import { COLLECTIONS_URL } from "../../configs/navigators";
import { BsSearch, BsSlashLg } from "react-icons/bs";
import { Collection } from "../../components/Collection";
import { Backdrop, CircularProgress } from "@mui/material";
import { getCollectionsLearning } from "../../store/slices/collectionSlice";

const CollectionsLearning = () => {
  const dispatch = useDispatch();
  const { isLoading, isError, collectionsLearning } = useSelector(
    (state) => state.collection
  );

  useEffect(() => {
    if (collectionsLearning === null) dispatch(getCollectionsLearning());
  }, [collectionsLearning, dispatch]);

  const [query, setQuery] = useState("");
  const onChangeQuery = (e) => {
    const value = e.target.value.toLowerCase();
    setQuery(value);
  };

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
  else if (collectionsLearning === null) return <></>;

  return (
    <div className="collections-container mt-3">
      <div>
        # Search for Collections learning - topic / creator / my collection
      </div>
      <div className="input-group mt-2 mb-3">
        <input
          type="search"
          className="form-control dark-input"
          placeholder="Search"
          autoComplete="off"
          value={query}
          onChange={onChangeQuery}
        />
        <button className="input-group-append btn btn-outline-secondary">
          <BsSearch size={"22px"} />
        </button>
      </div>

      {collectionsLearning?.length > 0 ? (
        collectionsLearning.map((collection) => (
          <Collection key={collection.id} collection={collection} />
        ))
      ) : (
        <div className="meow-card text-center mt-3">
          No collections learning
        </div>
      )}
    </div>
  );
};

const Learn = () => {
  const { collectionsLearning } = useSelector((state) => state.collection);
  const { language_learning } = useSelector((state) => state.course);

  const [ishowLCM, setIshowLCM] = useState(false);

  return (
    <>
      {ishowLCM && <CollectionCreateModal onClose={() => setIshowLCM(false)} />}
      <Scrollup />
      <div>
        <div>
          Display word - phrase - sentence learned today / this week / month /
          year
        </div>
        <div>Time spent today / this week / month / year</div>
        <div>Countdown to next day </div>

        <section className="learn-section">
          <h2>Today</h2>
          <div className="learn-header">
            <div className="learn-practiced">
              Words practiced
              <span className="badge badge-pill badge-light">
                {"words_learned.count"}
              </span>
            </div>
            <br />
            <div className="learn-practiced">
              Phrases practiced
              <span className="badge badge-pill badge-light">
                {"phrases_learned.count"}
              </span>
            </div>
          </div>
          <br />
          <Link className="btn btn-outline-secondary" to={COLLECTIONS_URL}>
            Find new collections?
          </Link>
          <BsSlashLg size={"22px"} className="ms-2 me-2" />
          <button
            className="btn btn-outline-secondary"
            onClick={() => setIshowLCM(true)}
          >
            Create new collection?
          </button>

          <div className="hr" />
          <div>
            {language_learning?.language} Collections learning
            <span
              id="collections-learning-counter"
              className="badge badge-pill badge-light"
            >
              {collectionsLearning?.length || 0}
            </span>
          </div>
        </section>

        <section className="learning-section">
          {/* <CollectionsLearning /> */}
        </section>
      </div>
    </>
  );
};

export default Learn;
