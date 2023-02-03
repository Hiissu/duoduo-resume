import React, { useEffect, useState } from "react";
import { BsX } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { COLLECTIONS_DETAIL_URL } from "../../configs/navigators";
import { createCollection } from "../../store/slices/collectionSlice";
import { Categories } from "../Category";
import { Modal } from "../Modal";
import "./CollectionCreateModal.css";

const CollectionCreateModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const { isError, message } = useSelector((state) => state.collection);

  const [name, setName] = useState("");
  const [bannerUrl, setBannerUrl] = useState(
    "https://images.unsplash.com/photo-1527901031195-a21e7b21052c"
  );
  const [description, setDescription] = useState("");
  const [topics, setTopics] = useState([]);

  const onChangeName = (e) => {
    setName(e.target.value);
  };
  const onChangeBanner = (e) => {
    setBannerUrl(e.target.value);
  };

  const onChangeDescription = (e) => {
    setDescription(e.target.value);
  };

  const onChangeTopics = (bool, object) => {
    if (bool) {
      setTopics([...topics, object]);
    } else {
      const newTopics = topics.collectionTopics.filter(
        (topic) => topic.id !== object.id
      );
      setTopics(newTopics);
    }
  };

  const navigate = useNavigate();
  const onCreateCollection = () => {
    const response = dispatch(
      createCollection({
        name,
        bannerUrl,
        description,
        topics,
      })
    );
    console.log("createCollection", response);
    if (isError) navigate(COLLECTIONS_DETAIL_URL(response.collection.id));
    else alert(message);
  };

  const [isCanCreate, setIsCanCreate] = useState(false);
  useEffect(() => {
    if (topics.length > 20 || name.length === 0) setIsCanCreate(false);
    else setIsCanCreate(true);
  }, [topics, name]);

  const [isLoadedImage, setIsLoadedImage] = useState(false);

  return (
    <Modal isBlackBackDrop={true} onClose={onClose}>
      <div className="lcm-banner-wrapper">
        <img
          className="lcm-banner"
          src={bannerUrl}
          alt=""
          onLoad={() => setIsLoadedImage(true)}
        />
      </div>
      <div className="lcm">
        <div className="lcm-container">
          <div className="moodal-header">
            <div className="moodal-closer pointer" onClick={() => onClose()}>
              <BsX size={"32px"} />
            </div>
            <div className="moodal-title">Create Collection</div>
          </div>
          <div className="lcm-content">
            <div className="form-group">
              <label htmlFor="lcm-collection-banner" className="label-cap mb-2">
                Collection banner url
              </label>
              <input
                type="text"
                className="form-control dark-input"
                id="lcm-collection-banner"
                autoComplete="off"
                maxLength="2020"
                value={bannerUrl}
                onChange={(e) => onChangeBanner(e)}
              />
            </div>
            <div className="hr" />
            <div className="form-group">
              <label
                htmlFor="lcm-collection-name"
                className={`label-cap mb-2 ${!name ? "text-danger" : ""}`}
              >
                Collection name *
              </label>
              <input
                type="text"
                className="form-control dark-input"
                id="lcm-collection-name"
                autoComplete="off"
                autoFocus
                maxLength="220"
                value={name}
                onChange={(e) => onChangeName(e)}
              />
            </div>
            <div className="hr" />
            <div className="form-group">
              <Categories
                topicsSelected={topics}
                onChangeTopics={onChangeTopics}
              />
            </div>
            <div className="hr" />
            <div className="form-group position-relative">
              <label htmlFor="lcm-desc" className="label-cap mb-2">
                Collection description
              </label>
              <textarea
                type="text"
                className="form-control dark-input lcm-desc"
                id="lcm-desc"
                maxLength="220"
                autoComplete="off"
                value={description}
                onChange={(e) => onChangeDescription(e)}
              />
              <span className="num-length">{description.length - 220}</span>
            </div>
            <div className="hr" />
          </div>
          <div className="form-group lcm-footer">
            <div className="col btn me-3" onClick={() => onClose()}>
              Cancel
            </div>
            <button
              className="col btn btn-secondary"
              disabled={!isCanCreate}
              onClick={() => onCreateCollection()}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CollectionCreateModal;
