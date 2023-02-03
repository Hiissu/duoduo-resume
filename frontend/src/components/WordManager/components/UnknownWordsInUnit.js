import styles from "../WordManager.module.css";
import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BsDash, BsSearch } from "react-icons/bs";
import UnknownWordInList from "./UnknownWordInList";
import { onSpeak } from "../../../store/slices/settingSlice";
import { VariableSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { latinize } from "../../../configs/functions";

const UnknownWordsInUnit = () => {
  const dispatch = useDispatch();
  const { unknownWordsInUnit } = useSelector((state) => state.unitManagement);

  const [query, setQuery] = useState("");
  const onSearchWords = (e) => {
    setQuery(e.target.value);
  };

  const [unknownsInMatchedList, setUnknownsInMatchedList] =
    useState(unknownWordsInUnit);

  useEffect(() => {
    const timer = setTimeout(() => {
      const queryLatinized = latinize(query).toLowerCase();

      setUnknownsInMatchedList(
        unknownWordsInUnit.filter(
          (element) =>
            latinize(element.word).toLowerCase().indexOf(queryLatinized) > -1
        )
      );
    }, 200);

    return () => clearTimeout(timer);
  }, [query, unknownWordsInUnit]);

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
          times={null}
          element={element}
          onClickSpeaker={() => dispatch(onSpeak(element.word, false, true))}
          onClickWord={() => {}}
          reachedTheLimit={() => {}}
        />
      </div>
    );
  };

  return (
    <>
      <label className={`label-cap mb-2 ${styles["main-label"]}`}>
        Unknown words in unit
        <BsDash className="ms-1 me-1" />
        {unknownWordsInUnit.length}
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
      <div className={styles["words-in-collection"]}>
        {unknownWordsInUnit.length > 0 ? (
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
                  itemCount={unknownsInMatchedList.length}
                  itemData={unknownsInMatchedList}
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
    </>
  );
};

export default UnknownWordsInUnit;
