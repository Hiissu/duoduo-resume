import styles from "../WordManager.module.css";
import React, { memo, useEffect, useRef, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { VariableSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import {
  BsDash,
  BsQuestionCircle,
  BsSearch,
  BsTranslate,
} from "react-icons/bs";
import { magicSVG } from "../../SVGs";
import { DarkTooltip } from "../../Tooltip";
import {
  Checkbox,
  FormControlLabel,
  IconButton,
  Slide,
  Snackbar,
  Switch,
} from "@mui/material";
import {
  addAll,
  removeAll,
  setText2Meow,
  setUseMyTranslation,
} from "../../../store/slices/unitManagementSlice";
import {
  resetRateLimit,
  microsoftTranslator,
} from "../../../store/slices/translatorSlice";
import { onSpeak } from "../../../store/slices/settingSlice";
import { isUseSpace, latinize } from "../../../configs/functions";
import {
  specialCharsRegex,
  wordTranslationVersion,
} from "../../../configs/constants";
import { Alert } from "../../Alert";
import WordInList from "./WordInList";
import UnknownWordInList from "./UnknownWordInList";

const WordsInDetectedList = ({
  query,
  wordsInDetectedList,
  onClickWord,
  indexesOf,
  isShowDetected,
  setIsShowDetected,
}) => {
  const dispatch = useDispatch();
  const { isCanClose, wordsInUnit, wordsWillAdd, wordsWillRemove } =
    useSelector((state) => state.unitManagement);

  const { meow } = useSelector((state) => state.user);

  const [wordsInMatchedList, setWordsInMatchedList] =
    useState(wordsInDetectedList);

  useEffect(() => {
    const timer = setTimeout(() => {
      const queryLatinized = latinize(query).toLowerCase();

      setWordsInMatchedList(
        wordsInDetectedList.filter(
          (element) =>
            latinize(element.word).toLowerCase().indexOf(queryLatinized) > -1
        )
      );
    }, 200);

    return () => clearTimeout(timer);
  }, [query, wordsInDetectedList]);

  const [isSnack, setIsSnack] = useState({ open: false, message: "" });
  const [checkAllDetected, setCheckAllDetected] = useState(false);

  const reachedTheLimit = () => {
    setIsSnack({
      open: true,
      message:
        "You have reached the limit for the number of unknowns you can add",
    });
  };

  useEffect(() => {
    if (isCanClose) setCheckAllDetected(false);
  }, [isCanClose]);

  const checkAllDetectedHandler = () => {
    if (checkAllDetected) {
      dispatch(removeAll({ type: "word" }));
      setCheckAllDetected(!checkAllDetected);
      return;
    }

    const wordsNone = wordsInDetectedList.filter(
      (element) =>
        !(
          wordsInUnit.some((ele) => ele.id === element.id) ||
          wordsWillAdd.some((ele) => ele.id === element.id) ||
          wordsWillRemove.some((ele) => ele.id === element.id)
        )
    );

    const maxNum = meow.is_premium ? 200 : 100;
    if (wordsNone.length + wordsWillAdd.length >= maxNum) {
      reachedTheLimit();
      return;
    }

    dispatch(addAll({ type: "word", all: wordsNone }));
    setCheckAllDetected(!checkAllDetected);
  };

  const listRef = useRef({});
  const rowHeights = useRef({});

  // https://codesandbox.io/s/react-chat-simulator-yg114
  // useEffect(() => {
  //   if (messages.length > 0) { scrollToBottom(); }
  //   // eslint-disable-next-line
  // }, [messages]);
  //
  // const scrollToBottom = () => {
  //   listRef.current.scrollToItem(messages.length - 1, "end");
  // };

  const getRowHeight = (index) => {
    return rowHeights.current[index] || 69;
  };

  const setRowHeight = (index, size) => {
    listRef.current.resetAfterIndex(0);
    rowHeights.current = { ...rowHeights.current, [index]: size };
  };

  const VariableSizeRow = ({ data, index, style }) => {
    const rowRef = useRef({});

    useEffect(() => {
      if (rowRef.current) {
        setRowHeight(index, rowRef.current.clientHeight);
      }
      // eslint-disable-next-line
    }, [rowRef]);

    const element = data[index];
    return (
      <div style={style} ref={rowRef} className={styles["word-row"]}>
        <WordInList
          times={indexesOf(element.word).length}
          element={element}
          onClickSpeaker={() => dispatch(onSpeak(element.word, false, true))}
          onClickWord={() => onClickWord(element.word)}
        />
      </div>
    );
  };

  const TransitionUp = (props) => {
    return <Slide {...props} direction="up" />;
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={isSnack.open}
        onClose={() => setIsSnack({ open: false, message: "" })}
        TransitionComponent={TransitionUp}
        // autoHideDuration={6000}
      >
        <Alert message={isSnack.message} severity={"danger"} />
      </Snackbar>

      <div className="form-group">
        <label
          htmlFor="words-detected-input"
          className="label-flexcap mb-2 pointer"
          onClick={() => setIsShowDetected(!isShowDetected)}
        >
          Words detected
          <BsDash className="ms-1 me-1" />
          {wordsInDetectedList.length}
        </label>
        {isShowDetected === true && wordsInDetectedList.length > 0 && (
          <div className="checkbox-all-wrapper">
            <DarkTooltip
              title={checkAllDetected ? "Remove All" : "Add All"}
              placement={"top"}
            >
              <div onClick={() => checkAllDetectedHandler()}>
                <span className="me-2">All</span>
                <Checkbox checked={checkAllDetected} />
              </div>
            </DarkTooltip>
          </div>
        )}

        {isShowDetected === true && (
          <div className={styles["words-detected"]}>
            {wordsInDetectedList.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flex: "1 1 auto",
                  flexGrow: 1,
                  height: "36vh",
                }}
              >
                <AutoSizer>
                  {({ height, width }) => (
                    <VariableSizeList
                      ref={listRef}
                      width={width}
                      height={height}
                      itemCount={wordsInMatchedList.length}
                      itemData={wordsInMatchedList}
                      itemSize={getRowHeight}
                    >
                      {VariableSizeRow}
                    </VariableSizeList>
                  )}
                </AutoSizer>
              </div>
            ) : (
              <div className="text-center mt-3">No words available</div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

const WordsInUnknownList = ({
  query,
  wordsInUnknownList,
  onClickWord,
  indexesOf,
  isShowDetected,
  setIsShowDetected,
}) => {
  const dispatch = useDispatch();
  const {
    isCanClose,
    unknownWordsInUnit,
    unknownWordsWillAdd,
    unknownWordsWillRemove,
    useMyTranslation,
  } = useSelector((state) => state.unitManagement);

  const { meow } = useSelector((state) => state.user);

  const [wordsInMatchedList, setWordsInMatchedList] =
    useState(wordsInUnknownList);

  useEffect(() => {
    const timer = setTimeout(() => {
      const queryLatinized = latinize(query).toLowerCase();

      setWordsInMatchedList(
        wordsInUnknownList.filter(
          (element) =>
            latinize(element.word).toLowerCase().indexOf(queryLatinized) > -1
        )
      );
    }, 200);

    return () => clearTimeout(timer);
  }, [query, wordsInUnknownList]);

  const [isSnack, setIsSnack] = useState({ open: false, message: "" });
  const [checkAllUnknown, setCheckAllUnknown] = useState(false);

  const reachedTheLimit = () => {
    setIsSnack({
      open: true,
      message:
        "You have reached the limit for the number of unknowns you can add",
    });
  };

  useEffect(() => {
    if (isCanClose) setCheckAllUnknown(false);
  }, [isCanClose]);

  const checkAllUnknownHandler = () => {
    if (checkAllUnknown) {
      dispatch(removeAll({ type: "unknown_word" }));
      setCheckAllUnknown(!checkAllUnknown);
      return;
    }

    if (useMyTranslation) {
      setIsSnack({
        open: true,
        message: "Cannot use Add All when Auto Translate is OFF",
      });
      return;
    }

    const wordsNone = wordsInUnknownList.filter(
      (element) =>
        !(
          unknownWordsInUnit.some((ele) => ele.word === element.word) ||
          unknownWordsWillAdd.some((ele) => ele.word === element.word) ||
          unknownWordsWillRemove.some((ele) => ele.word === element.word)
        )
    );

    const maxNum = meow.is_premium ? 200 : 100;
    if (wordsNone.length + unknownWordsWillAdd.length >= maxNum) {
      reachedTheLimit();
      return;
    }

    const bodyTexts = wordsNone.map((element) => ({
      Text: element.word,
    }));

    (async () => {
      const response = await dispatch(microsoftTranslator({ bodyTexts }));
      const translatedTexts = response.payload;

      if (!translatedTexts) {
        setIsSnack({
          open: true,
          message: "Something went wrong x_x",
        });
        return;
      }

      translatedTexts.forEach((element, index) => {
        const elementIndexing = wordsNone[index];

        const initialTran = {
          pos: "undefined",
          note: "",
          definitions: [],
          meanings: [
            {
              meaning: element.translations[0].text.replace(
                specialCharsRegex,
                ""
              ),
              reverses: [],
            },
          ],
        };

        const translation = {
          ipa: "",
          image_url: "",
          trans: [initialTran],
          version: wordTranslationVersion,
        };

        const points = {
          writing: 0,
          reading: 0,
          speaking: 0,
          listening: 0,
          last_practiced: Date.now(),
        };

        wordsNone[index] = { ...elementIndexing, translation, points };
      });

      dispatch(addAll({ type: "unknown_word", all: wordsNone }));
    })();

    setCheckAllUnknown(!checkAllUnknown);
  };

  const listRef = useRef({});
  const rowHeights = useRef({});

  const getRowHeight = (index) => {
    return rowHeights.current[index] || 69;
  };

  const setRowHeight = (index, size) => {
    listRef.current.resetAfterIndex(0);
    rowHeights.current = { ...rowHeights.current, [index]: size };
  };

  const VariableSizeRow = ({ data, index, style }) => {
    const rowRef = useRef({});

    useEffect(() => {
      if (rowRef.current) {
        setRowHeight(index, rowRef.current.clientHeight);
      }
      // eslint-disable-next-line
    }, [rowRef]);

    const element = data[index];
    return (
      <div style={style} ref={rowRef} className={styles["word-row"]}>
        <UnknownWordInList
          times={indexesOf(element.word).length}
          element={element}
          onClickSpeaker={() => dispatch(onSpeak(element.word, false, true))}
          onClickWord={() => onClickWord(element.word)}
          reachedTheLimit={reachedTheLimit}
        />
      </div>
    );
  };

  const TransitionUp = (props) => {
    return <Slide {...props} direction="up" />;
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={isSnack.open}
        onClose={() => setIsSnack({ open: false, message: "" })}
        TransitionComponent={TransitionUp}
        // autoHideDuration={6000}
      >
        <Alert message={isSnack.message} severity={"danger"} />
      </Snackbar>

      <div className="form-group">
        <label
          htmlFor="unknown-words-input"
          className="label-flexcap mb-2 pointer"
          onClick={() => setIsShowDetected(!isShowDetected)}
        >
          Unknown words
          <BsDash className="ms-1 me-1" />
          {wordsInUnknownList.length}
          <DarkTooltip
            title={"Words are not available in our dictionary yet"}
            placement={"top"}
          >
            <IconButton>
              <BsQuestionCircle size={"22px"} className="ms-2" />
            </IconButton>
          </DarkTooltip>
        </label>
        {isShowDetected === false && wordsInUnknownList.length > 0 && (
          <div className="checkbox-all-wrapper">
            {!useMyTranslation && <BsTranslate size={20} />}
            <FormControlLabel
              control={
                <Switch
                  color="secondary"
                  checked={!useMyTranslation}
                  onChange={() => dispatch(setUseMyTranslation())}
                />
              }
              label="Auto Translate"
              labelPlacement="start"
            />
            <DarkTooltip
              title={checkAllUnknown ? "Remove All" : "Add All"}
              placement={"top"}
            >
              <div onClick={() => checkAllUnknownHandler()} className="ms-3">
                <span className="me-2">All</span>
                <Checkbox checked={checkAllUnknown} />
              </div>
            </DarkTooltip>
          </div>
        )}

        {isShowDetected === false && (
          <div className={styles["unknown-words"]}>
            {wordsInUnknownList.length > 0 ? (
              <div
                style={{
                  display: "flex",
                  flex: "1 1 auto",
                  flexGrow: 1,
                  height: "36vh",
                }}
              >
                <AutoSizer>
                  {({ height, width }) => (
                    <VariableSizeList
                      ref={listRef}
                      width={width}
                      height={height}
                      itemCount={wordsInMatchedList.length}
                      itemData={wordsInMatchedList}
                      itemSize={getRowHeight}
                    >
                      {VariableSizeRow}
                    </VariableSizeList>
                  )}
                </AutoSizer>
              </div>
            ) : (
              <div className="text-center mt-3">No unknowns available</div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

const Text2Words = () => {
  const dispatch = useDispatch();

  const { language_learning } = useSelector((state) => state.course);

  useEffect(() => {
    dispatch(resetRateLimit());
  }, [dispatch]);

  const { text2Meow, wordsInDict } = useSelector(
    (state) => state.unitManagement
  );

  const text2WordsRef = useRef();
  const [text2Words, setText2Words] = useState(text2Meow);

  useEffect(() => {
    const handler = setTimeout(() => dispatch(setText2Meow(text2Words)), 3000);
    return () => clearTimeout(handler);
  }, [dispatch, text2Words]);

  const onChangeText2Words = (e) => {
    const value = e.target.value;
    setText2Words(value);
  };

  const [query, setQuery] = useState("");
  const onChangeQuery = (e) => {
    setQuery(e.target.value);
  };

  const [wordsInDetectedList, setWordsInDetectedList] = useState([]);
  const [wordsInUnknownList, setWordsInUnknownList] = useState([]);

  const [wordsWithIndexes, setWordsWithIndexes] = useState([]);
  const prevIndexesRef = useRef({ obj: "", indexa: [], lasti: 0 });

  const onText2Words = () => {
    const wordsInText = [];
    const regex = ` \`~!@#$%^&*()_|+-=?;:'",.<>{}[]\\/—“。”–’…`;
    const regexArray = regex.split("");

    // text2Words.split(/\r?\n/)
    const text2wordsReplaced = text2Words.replace(/[\r\n]/gm, " ");
    // const isSpace = isUseSpace(language_learning.language_code);
    let isSpace = isUseSpace("ja");

    // https://stackoverflow.com/a/26358856
    // if browser is Firefox then set isSpace to true
    if (navigator.userAgent.indexOf("Firefox") !== -1) isSpace = true;

    for (let o = 0, s = 0, l = text2wordsReplaced.length; o < l; o++) {
      if (regexArray.indexOf(text2wordsReplaced[o]) > -1) {
        const wordSubed = text2wordsReplaced.substring(s, o).trim();

        // if not use space then use Intl.Segmenter()
        if (!isSpace) {
          // language_learning.language_code,
          const segmenterLearning = new Intl.Segmenter("ja", {
            granularity: "word",
          });

          const segments = Array.from(segmenterLearning.segment(wordSubed));
          segments.forEach((element) => {
            const e = s + element.segment.length;
            if (element.isWordLike)
              wordsInText.push({
                word: element.segment,
                indexes: [{ start: s, end: e }],
              });

            s = e;
          });
        } else
          wordsInText.push({
            word: wordSubed,
            indexes: [{ start: s, end: o }],
          });

        s = o + 1;
      }

      // push the rest
      if (o === l - 1) {
        if (s < l) {
          const rest = text2wordsReplaced.substring(s, l).trim();

          if (rest.length > 0)
            wordsInText.push({ word: rest, indexes: [{ start: s, end: l }] });
        }
      }
    }

    const newWordsInText = [];
    // remove word and combine indexes if duplicate
    wordsInText.forEach((element) => {
      if (element.word.trim().length > 0) {
        if (!newWordsInText.some((ele) => ele.word === element.word)) {
          newWordsInText.push(element);
        } else {
          newWordsInText.forEach((ele) => {
            if (ele.word === element.word) {
              ele.indexes = [...ele.indexes, ...element.indexes];
            }
          });
        }
      }
    });

    setWordsWithIndexes(newWordsInText);
    prevIndexesRef.current = { obj: "", indexa: [], lasti: 0 };

    const wordsDetected = [];
    const wordsUnknown = [];

    newWordsInText.forEach((element) => {
      const found = wordsInDict.find((ele) => ele.word === element.word);
      if (found) wordsDetected.push(found);
      else wordsUnknown.push({ word: element.word });
    });

    setWordsInDetectedList(wordsDetected);
    setWordsInUnknownList(wordsUnknown);
  };

  useEffect(() => {
    const handler = setTimeout(() => onText2Words(), 200);

    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text2Words]);

  const indexesOf = useCallback(
    (word) => {
      const found = wordsWithIndexes.find((element) => element.word === word);
      if (found) return found.indexes;
      else {
        // while rendering old ones in Detected & Unknown list causing error if not return []
        return [];
      }
    },
    [wordsWithIndexes]
  );

  const onClickWord = useCallback(
    (word) => {
      let selectionStart, selectionEnd;
      wordsWithIndexes.forEach((element) => {
        if (element.word === word) {
          const firstIndex = element.indexes[0];
          selectionStart = firstIndex.start;
          selectionEnd = firstIndex.end;
        }
      });

      const currentIndexes = prevIndexesRef.current;
      // check is the same object ~> true ~ index > 0
      const isIndexIn = currentIndexes.obj === word;
      const currentLength = currentIndexes.indexa.length;
      if (isIndexIn) {
        if (currentIndexes.lasti < currentLength - 1) {
          // -> moving to next index
          const nextIndex = currentIndexes.indexa[currentIndexes.lasti + 1];
          selectionStart = nextIndex.start;
          selectionEnd = nextIndex.end;

          prevIndexesRef.current = {
            ...currentIndexes,
            lasti: currentIndexes.lasti + 1,
          };
        } else
          prevIndexesRef.current = {
            ...currentIndexes,
            lasti: 0,
          };
      } else {
        const indexes = indexesOf(word);
        prevIndexesRef.current = { obj: word, indexa: indexes, lasti: 0 };
      }
      // or maybe scroll work with .set -> .blur -> .focus
      text2WordsRef.current.setSelectionRange(selectionStart, selectionStart);
      text2WordsRef.current.focus();
      text2WordsRef.current.setSelectionRange(selectionStart, selectionEnd);
    },
    [indexesOf, wordsWithIndexes, text2WordsRef]
  );

  const [isShowDetected, setIsShowDetected] = useState(true);

  return (
    <>
      <div className={styles.text2words}>
        <label
          htmlFor={styles["text2words-input"]}
          className={`label-cap mb-2 ${styles["main-label"]}`}
        >
          Text to Words
        </label>
        <div className={styles.transfer}>
          <div className={styles["text2words-wrapper"]}>
            <textarea
              type="text"
              className={`form-control dark-input ${styles["text2words-input"]} mb-2`}
              id={styles["text2words-input"]}
              placeholder="Enter your text"
              autoComplete="off"
              ref={text2WordsRef}
              value={text2Words}
              onChange={(e) => onChangeText2Words(e)}
            />
            <small>
              {magicSVG(16, "ms-2 me-2")}
              Use ( space _ ) to separate words
            </small>
            <div className="input-group mt-2">
              <input
                type="search"
                className="form-control dark-input"
                placeholder="Search Words"
                autoComplete="off"
                value={query}
                onChange={(e) => onChangeQuery(e)}
              />
              <button className="input-group-append btn btn-outline-secondary">
                <BsSearch size={"22px"} />
              </button>
            </div>
          </div>
          <div className="hr" />
          <div className={styles["transfer-detail"]}>
            <WordsInDetectedList
              query={query}
              wordsInDetectedList={wordsInDetectedList}
              onClickWord={onClickWord}
              indexesOf={indexesOf}
              isShowDetected={isShowDetected}
              setIsShowDetected={setIsShowDetected}
            />
            <div className="hr" />
            <WordsInUnknownList
              query={query}
              wordsInUnknownList={wordsInUnknownList}
              onClickWord={onClickWord}
              indexesOf={indexesOf}
              isShowDetected={isShowDetected}
              setIsShowDetected={setIsShowDetected}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default memo(Text2Words);
