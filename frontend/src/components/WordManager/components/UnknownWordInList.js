import styles from "../WordManager.module.css";
import React, { useState, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Checkbox, CircularProgress, IconButton } from "@mui/material";
import { BsArrowClockwise, BsPencil, BsVolumeUp, BsX } from "react-icons/bs";
import { DarkTooltip } from "../../Tooltip";
import {
  addWill,
  removeWill,
  updateUnknownTranslation,
} from "../../../store/slices/unitManagementSlice";
import {
  argosopentechTranslate,
  easy4LearnApi,
  googleApisTranslate,
} from "../../../store/slices/translatorSlice";
import {
  specialCharsRegex,
  wordTranslationVersion,
} from "../../../configs/constants";
import { WordTranModal } from "../../WordModal";

const UnknownWordInList = ({
  times,
  element,
  onClickSpeaker,
  onClickWord,
  reachedTheLimit,
}) => {
  const dispatch = useDispatch();

  const {
    unknownWordsInUnit,
    unknownWordsWillAdd,
    unknownWordsWillRemove,
    useMyTranslation,
  } = useSelector((state) => state.unitManagement);

  const [isTranModal, setIsTranModal] = useState({
    is: false,
    ic: false,
    object: {},
    action: () => {},
  });

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

  const UnknownWordWrap = () => {
    return (
      <>
        <Speaker />
        <Wordw />
        <TimesDisplay />
      </>
    );
  };

  const UnknownWordInWillAdd = ({ element }) => {
    const updateUnknownWordWillAdd = (object, translation) => {
      dispatch(
        updateUnknownTranslation({
          type: "unknown_word",
          will: true,
          object,
          translation,
        })
      );
    };

    return (
      <div className={`meow-card ${styles.wordwr} text-blue`}>
        <UnknownWordWrap />
        <DarkTooltip title={"Edit Translation"} placement={"top"}>
          <IconButton
            className="text-blue"
            onClick={() =>
              setIsTranModal({
                is: true,
                ic: false,
                object: element,
                action: updateUnknownWordWillAdd,
              })
            }
          >
            <BsPencil size={20} />
          </IconButton>
        </DarkTooltip>
        <DarkTooltip title={"Cancel Add"} placement={"top"}>
          <Checkbox
            checked={true}
            onChange={() => onRemoveWill("unknown_word", element, true)}
          />
        </DarkTooltip>
      </div>
    );
  };

  const UnknownWordInWillRemove = () => {
    return (
      <div
        className={`meow-card ${styles.wordwr} ${styles.removing} text-decoration-line-through text-pink`}
      >
        <UnknownWordWrap />
        <DarkTooltip title={"Cancel Remove"} placement={"top"}>
          <IconButton
            color="secondary"
            className="text-pink"
            onClick={() => onRemoveWill("unknown_word", element, false)}
          >
            <BsArrowClockwise />
          </IconButton>
        </DarkTooltip>
      </div>
    );
  };

  const UnknownWordInUnit = ({ element }) => {
    const updateUnknownWord = (object, translation) => {
      dispatch(
        updateUnknownTranslation({
          type: "unknown_word",
          will: false,
          object,
          translation,
        })
      );
    };

    return (
      <div className={`meow-card ${styles.wordwr}`}>
        <UnknownWordWrap />
        <DarkTooltip title={"Edit Translation"} placement={"top"}>
          <IconButton
            onClick={() =>
              setIsTranModal({
                is: true,
                ic: false,
                object: element,
                action: updateUnknownWord,
              })
            }
          >
            <BsPencil />
          </IconButton>
        </DarkTooltip>
        <DarkTooltip title={"Remove"} placement={"top"}>
          <Checkbox
            color="default"
            checked={true}
            onChange={() => onAddWill("unknown_word", element, false)}
          />
        </DarkTooltip>
      </div>
    );
  };

  const UnknownWordInDetected = () => {
    const {
      // isError,
      // isLoading,
      isEasy4LearnApi,
      isGoogleApiRateLimit,
      isArgosopentechApiRateLimit,
    } = useSelector((state) => state.translator);
    const { meow } = useSelector((state) => state.user);

    const [isLoading, setIsLoading] = useState(false);

    const createUnknown = (object, translation) => {
      const points = {
        writing: 0,
        reading: 0,
        speaking: 0,
        listening: 0,
        last_practiced: Date.now(), // or: new Date().getTime()
      };

      const unknown = {
        word: object.word,
        translation: translation,
        points: points,
      };

      setIsLoading(false);
      onAddWill("unknown_word", unknown, true);
    };

    const onAddWithGoogleApi = () => {
      (async () => {
        const response = await dispatch(
          googleApisTranslate({ text: element.word })
        );

        if (response.type.split("/").at(-1) === "rejected") return;

        const { trans, transDict } = response.payload;

        // const meaning = array2Fusion(trans);
        const initialTran = [
          {
            pos: "undefined",
            note: "",
            definitions: [],
            meanings: [
              {
                meaning: trans[0],
                reverses: [],
              },
            ],
          },
        ];

        const initialTranslation = {
          ipa: "",
          image_url: "",
          trans: transDict.length > 0 ? transDict : initialTran,
          version: wordTranslationVersion,
        };

        createUnknown(element, initialTranslation);
      })();
    };

    const onAddWithEasy4LearnApi = () => {
      (async () => {
        const response = await dispatch(easy4LearnApi({ text: element.word }));

        if (response.type.split("/").at(-1) === "rejected") return;

        const { ipa, meaning, trans } = response.payload;
        const initialTran = [
          {
            pos: "undefined",
            note: "",
            definitions: [],
            meanings: [
              {
                meaning: meaning,
                reverses: [],
              },
            ],
          },
        ];

        const initialTranslation = {
          ipa: ipa,
          image_url: "",
          trans: trans.length > 0 ? trans : initialTran,
          version: wordTranslationVersion,
        };

        createUnknown(element, initialTranslation);
      })();
    };

    const onAddWithArgosopentechApi = () => {
      (async () => {
        const response = await dispatch(
          argosopentechTranslate({ text: element.word })
        );
        console.log("argosopentechTranslate", response);

        if (response.type.split("/").at(-1) === "rejected") return;

        const { translatedText } = response.payload;

        const initialTran = [
          {
            pos: "undefined",
            note: "",
            definitions: [],
            meanings: [
              {
                meaning: translatedText.replace(specialCharsRegex, ""),
                reverses: [],
              },
            ],
          },
        ];

        const initialTranslation = {
          ipa: "",
          image_url: "",
          trans: initialTran,
          version: wordTranslationVersion,
        };

        createUnknown(element, initialTranslation);
      })();
    };

    const onAddUnknown = () => {
      const maxNum = meow.is_premium ? 200 : 100;
      if (unknownWordsWillAdd.length >= maxNum) {
        reachedTheLimit();
        return;
      }

      setIsLoading(true);
      if (useMyTranslation) {
        setIsTranModal({
          is: true,
          ic: true,
          object: element,
          action: createUnknown,
        });
        return;
      }

      if (!isGoogleApiRateLimit) {
        onAddWithGoogleApi();
      } else if (!isEasy4LearnApi) {
        onAddWithEasy4LearnApi();
      } else if (!isArgosopentechApiRateLimit) {
        onAddWithArgosopentechApi();
      }
    };

    return (
      <div className={`meow-card ${styles.wordwr}`}>
        <UnknownWordWrap />
        {isLoading && <CircularProgress color="inherit" size={26} />}
        <DarkTooltip title={"Add"} placement={"top"}>
          <Checkbox color="default" checked={false} onChange={onAddUnknown} />
        </DarkTooltip>
      </div>
    );
  };

  const InWhat = () => {
    const foundInWillAdd = unknownWordsWillAdd.find(
      (ele) => ele.word === element.word
    );
    if (foundInWillAdd)
      return <UnknownWordInWillAdd element={foundInWillAdd} />;

    if (unknownWordsWillRemove.some((ele) => ele.word === element.word))
      return <UnknownWordInWillRemove />;

    const foundInUnit = unknownWordsInUnit.find(
      (ele) => ele.word === element.word
    );
    if (foundInUnit) return <UnknownWordInUnit element={foundInUnit} />;

    return <UnknownWordInDetected />;
  };

  return (
    <>
      {isTranModal.is && (
        <WordTranModal
          object={isTranModal.object}
          isReadOnly={false}
          onClose={() => setIsTranModal({ ...isTranModal, is: false })}
          isCreate={isTranModal.ic}
          // true as default
          isCreator={true}
          onAction={isTranModal.action}
        />
      )}

      <InWhat />
    </>
  );
};

export default memo(UnknownWordInList);
