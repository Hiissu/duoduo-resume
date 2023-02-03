import styles from "./WillDrawer.module.css";
import wmStyles from "../WordManager/WordManager.module.css";
import pmStyles from "../PhraseManager/PhraseManager.module.css";
import smStyles from "../SentenceManager/SentenceManager.module.css";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BsDash, BsSearch, BsSnow2, BsX } from "react-icons/bs";
import { Drawer } from "../Drawer";
import { DarkTooltip } from "../Tooltip";
import { latinize } from "../../configs/functions";
import { VariableSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { UnknownWordInList, WordInList } from "../WordManager/components";
import { onSpeak } from "../../store/slices/settingSlice";

const WillRemoveDrawer = ({ onClose }) => {
  console.log("WillRemoveDrawer render");

  const dispatch = useDispatch();

  const {
    managing,
    optioning,
    wordsWillRemove,
    phrasesWillRemove,
    sentencesWillRemove,
    unknownWordsWillRemove,
    unknownPhrasesWillRemove,
    unknownSentencesWillRemove,
  } = useSelector((state) => state.unitManagement);

  const [wills] = useState([
    { key: 0, text: "Words" },
    { key: 1, text: "Phrases" },
    { key: 2, text: "Sentences" },
    { key: 3, text: "Unknown words" },
    { key: 4, text: "Unknown phrases" },
    { key: 5, text: "Unknown sentences" },
  ]);

  const recoginzeOption = () => {
    if (managing === 0 && optioning === 3) return 3;
    else if (managing === 1 && optioning === 3) return 4;
    else if (managing === 2 && optioning === 3) return 5;
    else if (managing === 0) return 0;
    else if (managing === 1) return 1;
    else if (managing === 2) return 2;
    else return 0;
  };

  const [query, setQuery] = useState("");
  const onSearchWill = (e) => {
    setQuery(e.target.value);
  };

  const [willWhat, setWillWhat] = useState(() => recoginzeOption());
  const [willList, setWillList] = useState([]);

  useEffect(() => {
    const queryLatinized = latinize(query).toLowerCase();

    switch (willWhat) {
      case 0:
        setWillList(
          wordsWillRemove.filter(
            (element) =>
              latinize(element.word).toLowerCase().indexOf(queryLatinized) > -1
          )
        );
        break;
      case 1:
        setWillList(
          phrasesWillRemove.filter(
            (element) =>
              latinize(element.phrase).toLowerCase().indexOf(queryLatinized) >
              -1
          )
        );
        break;
      case 2:
        setWillList(
          sentencesWillRemove.filter(
            (element) =>
              latinize(element.sentence).toLowerCase().indexOf(queryLatinized) >
              -1
          )
        );
        break;
      case 3:
        setWillList(
          unknownWordsWillRemove.filter(
            (element) =>
              latinize(element.word).toLowerCase().indexOf(queryLatinized) > -1
          )
        );
        break;
      case 4:
        setWillList(
          unknownPhrasesWillRemove.filter(
            (element) =>
              latinize(element.phrase).toLowerCase().indexOf(queryLatinized) >
              -1
          )
        );
        break;
      case 5:
        setWillList(
          unknownSentencesWillRemove.filter(
            (element) =>
              latinize(element.sentence).toLowerCase().indexOf(queryLatinized) >
              -1
          )
        );
        break;
      default:
        return;
    }
  }, [
    query,
    willWhat,
    wordsWillRemove,
    phrasesWillRemove,
    sentencesWillRemove,
    unknownWordsWillRemove,
    unknownPhrasesWillRemove,
    unknownSentencesWillRemove,
  ]);

  const listLength = (key) => {
    switch (key) {
      case 0:
        return wordsWillRemove.length;
      case 1:
        return phrasesWillRemove.length;
      case 2:
        return sentencesWillRemove.length;
      case 3:
        return unknownWordsWillRemove.length;
      case 4:
        return unknownPhrasesWillRemove.length;
      case 5:
        return unknownSentencesWillRemove.length;
      default:
        return 0;
    }
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

  const willRowClassName = () => {
    switch (willWhat) {
      case 0:
        return wmStyles["word-row"];
      case 1:
        return pmStyles["phrase-row"];
      case 2:
        return smStyles["sentence-row"];
      case 3:
        return wmStyles["word-row"];
      case 4:
        return pmStyles["phrase-row"];
      case 5:
        return smStyles["sentence-row"];
      default:
        return "";
    }
  };

  const WillRow = ({ element }) => {
    switch (willWhat) {
      case 0:
        return (
          <WordInList
            times={null}
            element={element}
            onClickSpeaker={() => dispatch(onSpeak(element.word, false, true))}
            onClickWord={() => {}}
          />
        );
      case 1:
        return phrasesWillRemove.length;
      case 2:
        return sentencesWillRemove.length;
      case 3:
        return (
          <UnknownWordInList
            times={null}
            element={element}
            onClickSpeaker={() => dispatch(onSpeak(element.word, false, true))}
            onClickWord={() => {}}
            reachedTheLimit={() => {}}
          />
        );
      case 4:
        return unknownPhrasesWillRemove.length;
      case 5:
        return unknownSentencesWillRemove.length;
      default:
        return <></>;
    }
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
      <div style={style} ref={rowRef} className={willRowClassName()}>
        <WillRow element={element} />
      </div>
    );
  };

  return (
    <>
      <Drawer
        anchor={"right"}
        width={"420px"}
        isBackdrop={true}
        onClose={onClose}
      >
        <section className={styles.header}>
          <h2 className={styles.title}>Will Remove</h2>
          <div className={styles.toolbar}>
            <DarkTooltip title="Close" placement="bottom-end">
              <span>
                <BsX size={32} onClick={() => onClose()} />
              </span>
            </DarkTooltip>
          </div>
        </section>
        <div className="">
          {wills.map((element) => (
            <label
              key={element.key}
              className="label-cap meow-card me-2"
              onClick={() => setWillWhat(element.key)}
            >
              {wills[willWhat].key === element.key && (
                <BsSnow2 size={22} className="me-2" />
              )}
              {element.text}
              <BsDash className="ms-1 me-1" />
              {listLength(element.key)}
            </label>
          ))}
        </div>
        <div className="input-group">
          <input
            type="search"
            className="form-control dark-input"
            placeholder="Search"
            autoComplete="off"
            value={query}
            autoFocus
            onChange={(e) => onSearchWill(e)}
          />
          <button className="input-group-append btn btn-outline-secondary">
            <BsSearch size={"22px"} />
          </button>
        </div>
        <section className={styles.container}>
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
                  itemCount={willList.length}
                  itemData={willList}
                  itemSize={getRowHeight}
                >
                  {VariableSizeRow}
                </VariableSizeList>
              )}
            </AutoSizer>
          </div>
        </section>
      </Drawer>
    </>
  );
};

export default WillRemoveDrawer;
