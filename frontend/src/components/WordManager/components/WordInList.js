import styles from "../WordManager.module.css";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BsArrowClockwise, BsVolumeUp, BsX } from "react-icons/bs";
import { DarkTooltip } from "../../Tooltip";
import { Checkbox, CircularProgress, IconButton } from "@mui/material";
import { addWill, removeWill } from "../../../store/slices/unitManagementSlice";
import {
  EditOff,
  CreateRounded,
  TranslateRounded,
  Delete,
} from "@mui/icons-material";
import { WordTranModal } from "../../WordModal";
import {
  createWordTranslation,
  deleteWordTranslation,
  findWordTranslations,
  updateWordTranslation,
} from "../../../store/slices/wordSlice";

const WordInList = ({ times, element, onClickSpeaker, onClickWord }) => {
  const dispatch = useDispatch();

  const { meow } = useSelector((state) => state.user);
  const { wordsInUnit, wordsWillAdd, wordsWillRemove } = useSelector(
    (state) => state.unitManagement
  );

  const [isTranModal, setIsTranModal] = useState({
    is: false,
    ic: false,
    object: {},
    action: () => {},
  });

  const [isLoading, setIsLoading] = useState(false);
  const [translationFound, setTranslationFound] = useState(null);

  const onRemoveWill = (type, object, will) => {
    dispatch(removeWill({ type, object, will }));
  };

  const onAddWill = (type, object, will) => {
    dispatch(addWill({ type, object, will }));
  };

  const Speaker = () => {
    return (
      <IconButton onClick={onClickSpeaker}>
        <BsVolumeUp size={"22px"} />
      </IconButton>
    );
  };

  const Wordw = () => {
    return (
      <div className={styles.wordw} onClick={onClickWord}>
        {element.word}
      </div>
    );
  };

  const TimesDisplay = () => {
    if (!times) return;

    return (
      <DarkTooltip title={"Times Display"} placement={"top"}>
        <small className={styles["times-display"]}>
          <BsX size={"12px"} />
          <span>{times}</span>
        </small>
      </DarkTooltip>
    );
  };

  const onCreateTranslation = (object, translation) => {
    dispatch(
      createWordTranslation({
        wordId: element.id,
        translation: translation,
      })
    );
  };

  const onUpdateTranslation = (object, translation) => {
    if (!object.is_default)
      dispatch(
        updateWordTranslation({
          wordId: element.id,
          translationId: object.id,
          translation: translation,
        })
      );
  };

  const onEditTranslation = () => {
    setIsTranModal({
      is: true,
      ic: false,
      object: isTranModal.object,
      action: onUpdateTranslation,
    });
  };

  const onDeleteTranslation = () => {
    dispatch(deleteWordTranslation({ translationId: isTranModal.object.id }));
  };

  const onFindTranslation = () => {
    setIsLoading(true);

    (async () => {
      const response = await dispatch(findWordTranslations(element.id));

      setIsLoading(false);
      setTranslationFound(response);
      setIsTranModal({
        is: true,
        ic: false,
        object: response,
        action: response.is_creator ? onUpdateTranslation : onCreateTranslation,
      });
    })();
  };

  const Translator = () => {
    return (
      <>
        {isLoading && <CircularProgress color="inherit" size={26} />}
        <DarkTooltip
          title={
            meow.is_premium
              ? "View/Override default translation"
              : "View default translation"
          }
          placement="top"
        >
          <IconButton className="ms-4" onClick={() => onFindTranslation()}>
            <TranslateRounded size={"22px"} />
          </IconButton>
        </DarkTooltip>
      </>
    );
  };

  const WordWrap = ({ will }) => {
    return (
      <>
        <Speaker />
        {will && <Translator />}
        <Wordw />
        <TimesDisplay />
      </>
    );
  };

  const WordInWillAdd = ({ element }) => {
    return (
      <div className={`meow-card`}>
        <div className={`${styles.wordwr} text-blue`}>
          <WordWrap will={true} />
          <DarkTooltip title={"Cancel Add"} placement={"top"}>
            <Checkbox
              checked={true}
              onChange={() => onRemoveWill("word", element, true)}
            />
          </DarkTooltip>
        </div>
        {translationFound && translationFound.is_creator && (
          <div className={styles["loaded-translation"]}>
            <DarkTooltip
              title="Will replace default translation"
              placement="top"
            >
              Custom translation for <i>{element.word}</i>
            </DarkTooltip>
            {translationFound.is_default ? (
              <DarkTooltip
                title="Cannot edit default translation"
                placement="top"
              >
                <IconButton className="ms-2">
                  <EditOff size={"22px"} />
                </IconButton>
              </DarkTooltip>
            ) : (
              <>
                <DarkTooltip title="Edit Translation" placement="top">
                  <IconButton
                    className="ms-2"
                    onClick={() => onEditTranslation()}
                  >
                    <CreateRounded size={"22px"} />
                  </IconButton>
                </DarkTooltip>
                <DarkTooltip title="Delete Translation" placement="top">
                  <IconButton
                    className="text-danger ms-2"
                    onClick={() => onDeleteTranslation()}
                  >
                    <Delete size={"22px"} />
                  </IconButton>
                </DarkTooltip>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  const WordInWillRemove = () => {
    return (
      <div
        className={`meow-card ${styles.wordwr} ${styles.removing} text-decoration-line-through text-pink`}
      >
        <WordWrap will={false} />
        <DarkTooltip title={"Cancel Remove"} placement={"top"}>
          <IconButton
            color="secondary"
            className="text-pink"
            onClick={() => onRemoveWill("word", element, false)}
          >
            <BsArrowClockwise />
          </IconButton>
        </DarkTooltip>
      </div>
    );
  };

  const WordInUnit = () => {
    return (
      <div className={`meow-card ${styles.wordwr}`}>
        <WordWrap will={true} />
        <DarkTooltip title={"Remove"} placement={"top"}>
          <Checkbox
            color="default"
            checked={true}
            onChange={() => onAddWill("word", element, false)}
          />
        </DarkTooltip>
      </div>
    );
  };

  const WordInDetected = () => {
    return (
      <div className={`meow-card ${styles.wordwr}`}>
        <WordWrap will={false} />
        <DarkTooltip title={"Add"} placement={"top"}>
          <Checkbox
            color="default"
            checked={false}
            onChange={() => onAddWill("word", element, true)}
          />
        </DarkTooltip>
      </div>
    );
  };

  const InWhat = () => {
    if (wordsWillAdd.some((ele) => ele.word === element.word))
      return <WordInWillAdd />;
    else if (wordsWillRemove.some((ele) => ele.word === element.word))
      return <WordInWillRemove />;
    else if (wordsInUnit.some((ele) => ele.word === element.word))
      return <WordInUnit />;
    else return <WordInDetected />;
  };

  return (
    <>
      {isTranModal.is && (
        <WordTranModal
          object={isTranModal.object}
          isReadOnly={false}
          onClose={() => setIsTranModal({ ...isTranModal, is: false })}
          isCreate={isTranModal.ic}
          isCreator={isTranModal.object.is_creator}
          onAction={isTranModal.action}
        />
      )}

      <InWhat />
    </>
  );
};

export default WordInList;
