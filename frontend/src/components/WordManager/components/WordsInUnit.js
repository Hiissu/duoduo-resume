import styles from "../WordManager.module.css";
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BsDash, BsSearch } from "react-icons/bs";
import WordInList from "./WordInList";
import { onSpeak } from "../../../store/slices/settingSlice";
import { VariableSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { latinize } from "../../../configs/functions";

const WordsInUnit = () => {
  const dispatch = useDispatch();
  const { wordsInUnit } = useSelector((state) => state.unitManagement);

  const [query, setQuery] = useState("");
  const onSearchWords = (e) => {
    setQuery(e.target.value);
  };

  const [wordsInMatchedList, setWordsInMatchedList] = useState(wordsInUnit);

  useEffect(() => {
    const timer = setTimeout(() => {
      const queryLatinized = latinize(query).toLowerCase();

      setWordsInMatchedList(
        wordsInUnit.filter(
          (element) =>
            latinize(element.word).toLowerCase().indexOf(queryLatinized) > -1
        )
      );
    }, 200);

    return () => clearTimeout(timer);
  }, [query, wordsInUnit]);

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
        <WordInList
          times={null}
          element={element}
          onClickSpeaker={() => dispatch(onSpeak(element.word, false, true))}
          onClickWord={() => {}}
        />
      </div>
    );
  };

  return (
    <>
      <label className={`label-cap mb-2 ${styles["main-label"]}`}>
        Words in unit
        <BsDash className="ms-1 me-1" />
        {wordsInUnit.length}
      </label>
      <div className="input-group">
        <input
          type="search"
          className="form-control dark-input"
          placeholder="Search Words"
          autoComplete="off"
          value={query}
          autoFocus={true}
          onChange={(e) => onSearchWords(e)}
        />
        <button className="input-group-append btn btn-outline-secondary">
          <BsSearch size={"22px"} />
        </button>
      </div>
      <div className="hr" />
      {wordsInUnit.length > 0 ? (
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
    </>
  );
};

export default WordsInUnit;
