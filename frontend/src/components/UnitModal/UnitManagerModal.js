import "./UnitManagerModal.css";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BsCloudSnow, BsDash, BsSnow2 } from "react-icons/bs";
import { GiSnowing } from "react-icons/gi";
import { Modal } from "../Modal";
import { WillAddDrawer, WillRemoveDrawer } from "../WillDrawer";
import { WordManager } from "../WordManager";
import { Divider } from "@mui/material";
import {
  findUnit,
  resetInitial,
  resetWill,
  setManaging,
  setOptioning,
} from "../../store/slices/unitManagementSlice";
import { manageUnit } from "../../store/slices/unitSlice";

const UnitManagerModal = ({ unitId, collectionId, onClose }) => {
  console.log("UnitManagerModal Render");
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(resetInitial());
  // }, [dispatch]);

  // 0 1 2 ~ managing Words - Phrases - Sentences
  // 0 1 2 3 ~ Text to # - # in Dictionary - # in Unit - Unknown # in Unit
  const { managing, optioning } = useSelector((state) => state.unitManagement);

  const { isCanClose, isShowingMenu, numWillAdd, numWillRemove } = useSelector(
    (state) => state.unitManagement
  );

  const onSetManaging = useCallback(
    (manager) => {
      dispatch(setManaging(manager));
    },
    [dispatch]
  );

  const onSetOptioning = useCallback(
    (option) => {
      dispatch(setOptioning(option));
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(findUnit(collectionId, unitId));
  }, [collectionId, unitId, dispatch]);

  const [isShakeClose, setIsShakeClose] = useState(false);

  const onCloseModal = useCallback(() => {
    if (isCanClose) {
      onClose();
      dispatch(resetInitial());
    } else setIsShakeClose(true);
  }, [dispatch, isCanClose, onClose]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isCanClose === false && isShakeClose === true) setIsShakeClose(false);
    }, 1234);

    return () => {
      clearTimeout(timer);
    };
  }, [isCanClose, isShakeClose]);

  const onResetChanges = () => {
    dispatch(resetWill());
    setIsShakeClose(false);
  };

  const onSaveChanges = () => {
    console.log("\n On onSaveChanges");

    dispatch(manageUnit(collectionId, unitId));

    // show response.message popup on bottom left
    // show response.message error popup on bottom left
  };

  const [willAdd, setWillAdd] = useState(false);
  const [willRemove, setWillRemove] = useState(false);

  const OptionsSection = useCallback(() => {
    return (
      <section className="umm-options-section">
        <div
          className="meow-card umm-main-option"
          onClick={() => onSetManaging(0)}
        >
          <label className="label-cap mb-2 pointer">Words</label>
          {managing === 0 && <GiSnowing size={"22px"} className="ms-2" />}
        </div>
        {managing === 0 && (
          <>
            <Divider />
            <div className="umm-options">
              <label
                className="label-cap umm-option-label"
                onClick={() => onSetOptioning(0)}
              >
                Text to Words
                {optioning === 0 && <BsSnow2 size={"22px"} className="ms-2" />}
              </label>

              <label
                className="label-cap umm-option-label"
                onClick={() => onSetOptioning(1)}
              >
                Words in dictionary
                {optioning === 1 && <BsSnow2 size={"22px"} className="ms-2" />}
              </label>

              <label
                className="label-cap umm-option-label"
                onClick={() => onSetOptioning(2)}
              >
                Words in unit
                {optioning === 2 && <BsSnow2 size={"22px"} className="ms-2" />}
              </label>

              <label
                className="label-cap umm-option-label"
                onClick={() => onSetOptioning(3)}
              >
                Unknown Words in unit
                {optioning === 3 && <BsSnow2 size={"22px"} className="ms-2" />}
              </label>
            </div>
          </>
        )}
        <Divider />
        <div
          className="meow-card umm-main-option"
          onClick={() => onSetManaging(1)}
        >
          <label className="label-cap mb-2 pointer">Phrases</label>
          {managing === 1 && <GiSnowing size={"22px"} className="ms-2" />}
        </div>
        {managing === 1 && (
          <>
            <Divider />
            <div className="umm-options">
              <label
                className="label-cap umm-option-label"
                onClick={() => onSetOptioning(0)}
              >
                Text to Phrases
                {optioning === 0 && <BsSnow2 size={"22px"} className="ms-2" />}
              </label>

              <label
                className="label-cap umm-option-label"
                onClick={() => onSetOptioning(1)}
              >
                Phrases in dictionary
                {optioning === 1 && <BsSnow2 size={"22px"} className="ms-2" />}
              </label>

              <label
                className="label-cap umm-option-label"
                onClick={() => onSetOptioning(2)}
              >
                Phrases in unit
                {optioning === 2 && <BsSnow2 size={"22px"} className="ms-2" />}
              </label>

              <label
                className="label-cap umm-option-label"
                onClick={() => onSetOptioning(3)}
              >
                Unknown Phrases in unit
                {optioning === 3 && <BsSnow2 size={"22px"} className="ms-2" />}
              </label>
            </div>
          </>
        )}
        <Divider />
        <div
          className="meow-card umm-main-option"
          onClick={() => onSetManaging(2)}
        >
          <label className="label-cap mb-2 pointer">Sentences</label>
          {managing === 2 && <GiSnowing size={"22px"} className="ms-2" />}
        </div>
        {managing === 2 && (
          <>
            <Divider />
            <div className="umm-options">
              <label
                className="label-cap umm-option-label"
                onClick={() => onSetOptioning(0)}
              >
                Text to Sentences
                {optioning === 0 && <BsSnow2 size={"22px"} className="ms-2" />}
              </label>

              <label
                className="label-cap umm-option-label"
                onClick={() => onSetOptioning(1)}
              >
                Sentences in dictionary
                {optioning === 1 && <BsSnow2 size={"22px"} className="ms-2" />}
              </label>

              <label
                className="label-cap umm-option-label"
                onClick={() => onSetOptioning(2)}
              >
                Sentences in unit
                {optioning === 2 && <BsSnow2 size={"22px"} className="ms-2" />}
              </label>

              <label
                className="label-cap umm-option-label"
                onClick={() => onSetOptioning(3)}
              >
                Unknown Sentences in unit
                {optioning === 3 && <BsSnow2 size={"22px"} className="ms-2" />}
              </label>
            </div>
          </>
        )}

        <Divider />
        <div
          className="meow-card umm-main-option"
          onClick={() => setWillAdd(!willAdd)}
        >
          <label className="label-cap mb-2 pointer">
            Will Add <BsDash className="ms-1 me-1" />
            <span className={numWillAdd > 0 ? "text-blue" : ""}>
              {numWillAdd}
            </span>
          </label>
          {willAdd && <GiSnowing size={"22px"} className="ms-2" />}
        </div>
        <Divider />
        <div
          className="meow-card umm-main-option"
          onClick={() => setWillRemove(!willRemove)}
        >
          <label className="label-cap mb-2 pointer">
            Will Remove <BsDash className="ms-1 me-1" />
            <span className={numWillRemove > 0 ? "text-pink" : ""}>
              {numWillRemove}
            </span>
          </label>
          {willRemove && <GiSnowing size={"22px"} className="ms-2" />}
        </div>
      </section>
    );
  }, [
    managing,
    optioning,
    willAdd,
    numWillAdd,
    willRemove,
    numWillRemove,
    onSetManaging,
    onSetOptioning,
  ]);

  return (
    <Modal isBlackBackDrop={true} onClose={onCloseModal}>
      {willAdd && <WillAddDrawer onClose={() => setWillAdd(false)} />}
      {willRemove && <WillRemoveDrawer onClose={() => setWillRemove(false)} />}

      <div className="umm">
        {isShowingMenu && <OptionsSection />}
        {managing === 0 && <WordManager onClose={onCloseModal} />}
        {/* {managing === 1 && <PhraseManager />}
        {managing === 2 && <SentenceManager />} */}
      </div>

      {/* <ShakeAnimated isShake={isShakeClose}></ShakeAnimated> */}
      <div
        className={`form-row umm-footer 
          ${!isCanClose ? "eases-in" : "eases-out"} 
          ${isShakeClose ? "shake" : ""}
        `}
      >
        {/* <div className="col btn"><u>Cancel</u></div> */}
        <div className="col btn" onClick={() => onResetChanges()}>
          Reset
        </div>
        <button
          className="col btn btn-success"
          disabled={isCanClose}
          onClick={() => onSaveChanges()}
        >
          Save Changes
        </button>
      </div>
    </Modal>
  );
};

export default memo(UnitManagerModal);
