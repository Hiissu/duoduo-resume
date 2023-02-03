import "./CollectionDetail.css";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Scrollup } from "../../components/Scrollup";
import { Link } from "react-router-dom";
import { Backdrop, IconButton } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import {
  BsCalendar2RangeFill,
  BsSearch,
  BsStar,
  BsStarFill,
  BsMoonStars,
  BsSnow2,
} from "react-icons/bs";
import { CollectionPractice } from "../../components/CollectionPractice";
import { DarkTooltip } from "../../components/Tooltip";
import { NotFound } from "../NotFound";
import { DocumentViewModal } from "../../components/DocumentManager/components";
import { ImgViewerModal } from "../../components/Modal";
import { UnitManagerModal } from "../../components/UnitModal";
import { PROFILE_URL } from "../../configs/navigators";
import { bannerDefaultUrl } from "../../configs/constants";
import { findCollectionDetail } from "../../store/slices/collectionSlice";
import { DocumentManager } from "../../components/DocumentManager";

const CollectionDetail = () => {
  const dispatch = useDispatch();
  const { isLoading, isError } = useSelector((state) => state.collection);

  let { collectionId } = useParams();
  collectionId = parseInt(collectionId);

  const [collectionDetail, setCollectionDetail] = useState(null);

  useEffect(() => {
    if (!isNaN(collectionId) || collectionId > 0) {
      (async () => {
        const response = await dispatch(findCollectionDetail(collectionId));
        console.log(response);
        setCollectionDetail(response.payload);
      })();
    }
  }, [collectionId, dispatch]);

  // 0 1 2 ~ Units / Documents / Reviews
  const [optionSelected, setOptionSelected] = useState(0);

  const [isLearning, setIsLearning] = useState(false);
  const [bannerUrl, setBannerUrl] = useState(bannerDefaultUrl);

  useEffect(() => {
    if (collectionDetail) {
      setIsLearning(collectionDetail.is_learning);
      setBannerUrl(collectionDetail.banner_url);
    }
  }, [collectionDetail]);

  // const [collectionReviews, setCollectionReviews] = useState([]);
  // const onLoadReviews = useCallback(() => {
  //   (async () => {
  //     const response = await getCollectionReviews();
  //     setCollectionReviews(response.data);
  //   })();
  // }, [getCollectionReviews]);

  const [query, setQuery] = useState("");
  const onChangeQuery = (e) => {
    setQuery(e.target.value);
  };

  const [unitSelecting, setUnitSelecting] = useState(-1);
  const [documentSelecting, setDocumentSelecting] = useState({
    is: false,
    object: {},
  });

  const [isViewingBanner, setIsViewingBanner] = useState(false);

  const [isManagement, setIsManagement] = useState(false);
  const [isPractice, setIsPractice] = useState(false);

  const [documentManaging, setDocumentManaging] = useState(false);

  const FloatOptions = useCallback(() => {
    return (
      collectionDetail && (
        <div className="collection-detail-option">
          <button
            className="btn btn-outline-secondary"
            onClick={() => setOptionSelected(0)}
          >
            <div className="collection-detail-option-wrapper">
              <span className="badge badge-pill badge-light">
                {collectionDetail.units.length || 0}
              </span>
              Units
              {optionSelected === 0 && (
                <BsMoonStars size={"22px"} className="ms-2" />
              )}
            </div>
          </button>

          <button
            className="btn btn-outline-secondary"
            onClick={() => setOptionSelected(1)}
          >
            <div className="collection-detail-option-wrapper">
              <span className="badge badge-pill badge-light">
                {collectionDetail.documents.length || 0}
              </span>
              Documents
              {optionSelected === 1 && (
                <BsMoonStars size={"22px"} className="ms-2" />
              )}
            </div>
          </button>

          <button
            className="btn btn-outline-secondary"
            // onClick={() => onLoadReviews()}
          >
            <span className="badge badge-pill badge-light">{8}</span>
            Reviews
            {optionSelected === 2 && (
              <BsMoonStars size={"22px"} className="ms-2" />
            )}
          </button>

          <button
            className="btn btn-outline-secondary"
            onClick={() => setIsManagement(true)}
          >
            Management
          </button>

          <button
            className="btn btn-outline-success"
            onClick={() => setIsPractice(true)}
          >
            Practice
          </button>
        </div>
      )
    );
  }, [collectionDetail, optionSelected]);

  const UnitCard = useCallback(({ object, onClick }) => {
    return (
      <div className="meow-card" key={object.id} onClick={() => onClick()}>
        <div className="d-flex flex-column">
          <div className="collection-detail-card-header">
            <h3 className="">
              <span className="">{object.name}</span>
            </h3>
          </div>
          <div className="collection-detail-card-content">
            <strong>{object.description}</strong>
          </div>
        </div>

        <div className="collection-detail-card-footer">
          <DarkTooltip title={"Level"} placement={"top"}>
            <div className="collection-detail-card-footer-item">
              <BsSnow2 size={16} />
              <span className="ms-1">A2</span>
            </div>
          </DarkTooltip>
          <DarkTooltip title={"Latest Update"} placement={"top"}>
            <div className="collection-detail-card-footer-item">
              <BsCalendar2RangeFill size={16} />
              <span className="ms-1">{object.date_updated}</span>
            </div>
          </DarkTooltip>
        </div>
      </div>
    );
  }, []);

  const DocumentCard = useCallback(({ object, onClick }) => {
    return (
      <div className="meow-card" key={object.id} onClick={() => onClick()}>
        <div className="d-flex flex-column">
          <div className="collection-detail-card-header">
            <h3 className="">
              <span className="">{object.name}</span>
            </h3>
          </div>
          <div className="collection-detail-card-content">
            <strong>{object.description}</strong>
          </div>
        </div>

        <div className="collection-detail-card-footer">
          <DarkTooltip title={"Level"} placement={"top"}>
            <div className="collection-detail-card-footer-item">
              <BsSnow2 size={16} />
              <span className="ms-1">A2</span>
            </div>
          </DarkTooltip>
          <DarkTooltip title={"Latest Update"} placement={"top"}>
            <div className="collection-detail-card-footer-item">
              <BsCalendar2RangeFill size={16} />
              <span className="ms-1">{object.date_updated}</span>
            </div>
          </DarkTooltip>
        </div>
      </div>
    );
  }, []);

  const CollectionDetails = useCallback(() => {
    switch (optionSelected) {
      case 0:
        return collectionDetail && collectionDetail.units.length > 0 ? (
          collectionDetail.units.map(
            (unit) =>
              unit.name.toLowerCase().indexOf(query) > -1 && (
                <UnitCard
                  key={unit.id}
                  object={unit}
                  onClick={() => setUnitSelecting(unit.id)}
                />
              )
          )
        ) : (
          <div className="meow-card text-center mt-3">No units available</div>
        );

      case 1:
        return collectionDetail && collectionDetail.documents.length > 0 ? (
          collectionDetail.documents.map(
            (document, index) =>
              document.name.toLowerCase().indexOf(query) > -1 && (
                <DocumentCard
                  key={index}
                  object={document}
                  onClick={() =>
                    setDocumentSelecting({ is: true, object: document })
                  }
                />
              )
          )
        ) : (
          <div
            className="meow-card text-center mt-3"
            onClick={() => setDocumentManaging(true)}
          >
            No documents available
          </div>
        );

      default:
        return "";
    }
  }, [collectionDetail, optionSelected, query]);

  const CollectionTitle = useCallback(() => {
    switch (optionSelected) {
      case 0:
        return <span>Units in Collection</span>;
      case 1:
        return <span>Documents in Collection</span>;
      case 2:
        return <span>Collection's Reviews</span>;

      default:
        return "";
    }
  }, [optionSelected]);

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
  else if (isError || isNaN(collectionId)) return <NotFound />;
  else if (!collectionDetail) return <></>;

  return (
    <>
      <Scrollup />
      {isPractice && (
        <CollectionPractice
          collectionDetail={collectionDetail}
          onClose={() => setIsPractice(false)}
        />
      )}

      {documentManaging && (
        <DocumentManager onClose={() => setDocumentManaging(false)} />
      )}

      {/* {isManagement && (<CollectManagementOrSomething collectionId={collectionId} onClose={() => setIsManagement(false)} />)} 
      Put everything on, UnitManage - DocManage - Edit detail info - Videos - Quiz  - ...*/}

      {unitSelecting > -1 && (
        <UnitManagerModal
          unitId={unitSelecting}
          collectionId={collectionId}
          onClose={() => setUnitSelecting(-1)}
        />
      )}

      {documentSelecting.is && (
        <DocumentViewModal
          onClose={() =>
            setDocumentSelecting({ ...documentSelecting, is: false })
          }
          object={documentSelecting.object}
        />
      )}

      {isViewingBanner && (
        <ImgViewerModal
          imgUrl={bannerUrl}
          onClose={() => setIsViewingBanner(!isViewingBanner)}
        />
      )}
      <div
        className="collection-detail-banner"
        onClick={() => setIsViewingBanner(true)}
      >
        <img
          alt=""
          className="collection-detail-banner-img"
          src={bannerUrl}
          onError={() => setBannerUrl(bannerDefaultUrl)}
        />
      </div>
      <section className="collection-detail-section">
        <h2 className="mt-2">{collectionDetail.name}</h2>
        <div className="collection-wrapper">
          <div className="collection-diw">
            <div className="collection-label">Creator</div>
            <Link
              to={PROFILE_URL(collectionDetail.creator)}
              className="link-light"
            >
              {collectionDetail.creator}
            </Link>
          </div>
          <div className="collection-diw">
            {/* Created: {collectionDetail.date_created} */}
            <div className="collection-label">Latest update</div>
            <div>{collectionDetail.date_updated}</div>
          </div>
          <div className="collection-diw">
            <div className="collection-label">Learners</div>
            <div>{collectionDetail.num_learners}</div>
          </div>
          {isLearning ? (
            <DarkTooltip
              title={"Remove from Collections learning"}
              placement={"top"}
            >
              <IconButton color="default" onClick={() => setIsLearning(true)}>
                <BsStarFill />
              </IconButton>
            </DarkTooltip>
          ) : (
            <DarkTooltip
              title={"Add to Collections learning"}
              placement={"top"}
            >
              <IconButton color="default" onClick={() => setIsLearning(false)}>
                <BsStar />
              </IconButton>
            </DarkTooltip>
          )}
        </div>
        <div className="collection-diw">
          <div className="collection-label">Topics</div>
          <div className="collection-topics">
            {collectionDetail.topics.length > 0
              ? collectionDetail.topics.map((topic) => (
                  <div key={topic.id} className="collection-topic">
                    <div className="collection-topic-name">{topic.name}</div>
                  </div>
                ))
              : "-"}
          </div>
        </div>
        <div className="collection-diw flex-wrap">
          <div className="collection-label">Description</div>
          <div>{collectionDetail.description}</div>
        </div>
        <hr />
        <CollectionTitle />
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
        <CollectionDetails />
      </section>
      <FloatOptions />
    </>
  );
};

export default CollectionDetail;
