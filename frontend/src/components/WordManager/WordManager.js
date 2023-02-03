import styles from "./WordManager.module.css";
import React, { useEffect, useRef, useCallback, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BsXCircle } from "react-icons/bs";
import { ScrollupCustom } from "../Scrollup";
import {
  Text2Words,
  UnknownWordsInUnit,
  WordsInDictionary,
  WordsInUnit,
} from "./components";
import { RiMenuFoldLine } from "react-icons/ri";
import { setIsShowingMenu } from "../../store/slices/unitManagementSlice";
import { findWordsInDict, resetInitial } from "../../store/slices/wordSlice";
import { Slide, Snackbar } from "@mui/material";
import { Alert } from "../Alert";

const WordManager = ({ onClose }) => {
  console.log("WordManager Render");
  const dispatch = useDispatch();

  const { isError } = useSelector((state) => state.word);
  const { optioning } = useSelector((state) => state.unitManagement);

  useEffect(() => {
    dispatch(findWordsInDict());
    // dispatch(resetInitial());
  }, [dispatch]);

  const DetailSection = useCallback(() => {
    switch (optioning) {
      case 0:
        return <Text2Words />;
      case 1:
        return <WordsInDictionary />;
      case 2:
        return <WordsInUnit />;
      case 3:
        return <UnknownWordsInUnit />;
      default:
        break;
    }
  }, [optioning]);

  // ~ scrollup
  const modalContentRef = useRef();

  const TransitionDown = (props) => {
    return <Slide {...props} direction="down" />;
  };

  if (isError)
    return (
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={isError}
        onClose={() => {}}
        TransitionComponent={TransitionDown}
        // autoHideDuration={6000}
      >
        <Alert message={"Something went wrong x_x"} severity={"danger"} />
      </Snackbar>
    );

  return (
    <>
      <section className={styles.section}>
        <div className="moodal-header">
          <div className="moodal-closer" onClick={onClose}>
            <BsXCircle size={"32px"} />
            <div className="moodal-esc">ESC</div>
          </div>
          <RiMenuFoldLine
            size={22}
            className={styles.menu}
            onClick={() => dispatch(setIsShowingMenu())}
          />
          <div className="moodal-title">Word Manager</div>
        </div>
        <div className={styles.content} ref={modalContentRef}>
          <ScrollupCustom parentElement={modalContentRef} />
          <DetailSection />
        </div>
      </section>
    </>
  );
};

export default memo(WordManager);
