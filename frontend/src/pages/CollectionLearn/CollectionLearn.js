import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { CollectionPractice } from "../../components/CollectionPractice";
import { LEARN_URL } from "../../configs/navigators";
import { findCollectionDetail } from "../../store/slices/collectionSlice";
import { NotFound } from "../NotFound";
import "./CollectionLearn.css";

const CollectionLearn = () => {
  const dispatch = useDispatch();
  const { isLoading, isError } = useSelector((state) => state.collection);

  let { collectionId } = useParams();
  collectionId = parseInt(collectionId);

  const [isSuccess, setIsuccess] = useState(false);
  const [collectionDetail, setCollectionDetail] = useState({});

  useEffect(() => {
    if (isNaN(collectionId)) setIsuccess(false);
    else {
      const response = dispatch(findCollectionDetail(collectionId));
      setCollectionDetail(response);
    }
  }, [collectionId, dispatch]);

  const navigate = useNavigate();
  const navigate2Home = () => {
    navigate(LEARN_URL);
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
  else if (!isSuccess || isError) return <NotFound />;

  return (
    <CollectionPractice
      collectionDetail={collectionDetail}
      onClose={navigate2Home}
    />
  );
};

export default CollectionLearn;
