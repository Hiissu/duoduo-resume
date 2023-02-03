import "./Collection.css";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BsFillTrashFill, BsStar, BsStarFill } from "react-icons/bs";
import { GiSpellBook } from "react-icons/gi";
import { bannerDefaultUrl } from "../../configs/constants";
import { topicIds2Topics } from "../../configs/functions";
import { COLLECTIONS_DETAIL_URL, PROFILE_URL } from "../../configs/navigators";
import { ImgViewerModal } from "../Modal";
import { DarkTooltip } from "../Tooltip";
import { IconButton } from "@mui/material";
import {
  removeCollection,
  deleteCollection,
} from "../../store/slices/collectionSlice";

const Collection = ({ collection }) => {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const navigate2CollectionDetail = (collectionId) => {
    navigate(COLLECTIONS_DETAIL_URL(collectionId));
  };

  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.category);

  const onLearnCollection = (collection) => {
    // dispatch(learnCollection({ collectionId: collection.id }));
  };

  const onRemoveCollection = (collection) => {
    dispatch(removeCollection({ collectionId: collection.id }));
  };

  const onDeleteCollection = (collection) => {
    dispatch(deleteCollection({ collectionId: collection.id }));
  };

  const [showBanner, setShowBanner] = useState(false);
  const [collectionTopics, setCollectionTopics] = useState([]);
  const [collectionBannerUrl, setCollectionBannerUrl] = useState(
    collection.banner_url
  );

  useEffect(() => {
    setCollectionTopics(topicIds2Topics(collection.topics, categories));
  }, [categories, collection.topics]);

  return (
    <>
      {/* {ishowLRM && (
        <CollectionRemoveModal
          collectionSelected={collectionSelected}
          setClose={() => setIshowLRM(false)}
        />
      )}
      {ishowLDM && (
        <CollectionDeleteModal
          collectionSelected={collectionSelected}
          setClose={() => setIshowLDM(false)}
        />
      )} */}
      {showBanner && (
        <ImgViewerModal
          imgUrl={collectionBannerUrl}
          onClose={() => setShowBanner(!showBanner)}
        />
      )}
      <div className="collection-card">
        <div
          className="collection-banner"
          onClick={() => setShowBanner(!showBanner)}
        >
          <img
            alt=""
            className="collection-banner-img"
            src={collectionBannerUrl}
            onError={() => setCollectionBannerUrl(bannerDefaultUrl)}
          />
        </div>

        <div
          className="collection-detail"
          // onClick={() => navigate2CollectionDetail(collection.id)}
        >
          <Link to={COLLECTIONS_DETAIL_URL(collection.id)}>
            <h2>{collection.name}</h2>
          </Link>
          <div className="collection-wrapper">
            <div className="collection-diw">
              <div className="collection-label">Creator</div>
              <Link
                to={PROFILE_URL(collection.creator_username)}
                className="link-light"
              >
                {collection.creator_username}
              </Link>
            </div>
            <div className="collection-diw">
              {/* Created: {collection.date_created} */}
              <div className="collection-label">Latest update</div>
              <div>{collection.date_updated}</div>
            </div>
            <div className="collection-diw">
              <div className="collection-label">Learners</div>
              <div>{collection.num_learners}</div>
            </div>

            {collection.is_creator ? (
              ""
            ) : collection.is_learning ? (
              <DarkTooltip
                title={"Remove from Collections learning"}
                placement={"top"}
              >
                <IconButton
                  color="default"
                  className="pointer collection-learning"
                  onClick={() => onRemoveCollection(collection)}
                >
                  <BsStarFill />
                </IconButton>
              </DarkTooltip>
            ) : (
              <DarkTooltip
                title={"Add to Collections learning"}
                placement={"top"}
              >
                <IconButton
                  color="default"
                  className="pointer collection-learning"
                  onClick={() => onLearnCollection(collection)}
                >
                  <BsStar />
                </IconButton>
              </DarkTooltip>
            )}
          </div>

          <div className="collection-diw">
            <div className="collection-label">Topics</div>
            <div className="collection-topics">
              {collectionTopics?.length > 0
                ? collectionTopics.map((topic) => (
                    <div key={topic.id} className="collection-topic">
                      <div className="collection-topic-name">{topic.name}</div>
                    </div>
                  ))
                : "-"}
            </div>
          </div>
          <div className="collection-diw flex-wrap">
            <div className="collection-label">Description</div>
            <div>{collection.description}</div>
          </div>
        </div>

        <div className="collection-footer">
          <Link to={`/collections/${collection.id}/learn`}>
            <button className="btn btn-outline-secondary me-3">
              <GiSpellBook size={"18px"} className="me-3" />
              Learn
            </button>
          </Link>
          {collection.is_creator && (
            <button
              className="btn btn-outline-danger"
              onClick={() => onDeleteCollection(collection)}
            >
              <BsFillTrashFill size={"18px"} className="me-3" />
              Delete
            </button>
          )}
        </div>
      </div>

      <hr />
    </>
  );
};

export default Collection;
