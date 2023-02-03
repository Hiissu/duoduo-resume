import React, { useEffect, useRef, useState } from "react";
import {
  BsArrowClockwise,
  BsDash,
  BsPlus,
  BsSearch,
  BsX,
} from "react-icons/bs";
import { RemoveDeleteModal } from "../../Modal";
import { TooltipBasic } from "../../Tooltip";

const SentencesInDictionary = ({
  sentencesInDict,
  sentencesInUnit,
  // ~> for sentencesInAddList
  sentencesInAddList,
  onAddSentence,
  onCancelAddSentence,
  // ~> for sentencesInRemoveList
  sentencesInRemoveList,
  onRemoveSentence,
  onCancelRemoveSentence,
}) => {
  const querySentenceInDictRef = useRef();
  useEffect(() => {
    querySentenceInDictRef.current.focus();
  }, []);

  const [isRemoveSentence, setIsRemoveSentence] = useState({
    is: false,
    so: {},
  });

  const sentenceTail = (so) => {
    if (sentencesInAddList.some((stc) => stc.id === so.id)) {
      return (
        <TooltipBasic text={"Cancel Add"}>
          <button
            className="btn btn-outline-secondary text-blue"
            onClick={() => onCancelAddSentence(so)}
          >
            <BsArrowClockwise />
          </button>
        </TooltipBasic>
      );
    } else if (sentencesInRemoveList.some((stc) => stc.id === so.id)) {
      return (
        <TooltipBasic text={"Cancel Remove"}>
          <button
            className="btn btn-outline-secondary text-pink"
            onClick={() => onCancelRemoveSentence(so)}
          >
            <BsArrowClockwise />
          </button>
        </TooltipBasic>
      );
    } else if (sentencesInUnit.some((stc) => stc.id === so.id)) {
      return (
        <TooltipBasic text={"Remove"}>
          <button
            className="btn btn-outline-secondary text-green"
            onClick={() => setIsRemoveSentence({ is: true, so: so })}
          >
            <BsX />
          </button>
        </TooltipBasic>
      );
    } else {
      return (
        <TooltipBasic text={"Add"}>
          <button
            className="btn btn-outline-secondary"
            onClick={() => onAddSentence(so)}
          >
            <BsPlus />
          </button>
        </TooltipBasic>
      );
    }
  };

  //  remove hr and add effect hover sentences
  const [queryhSentenceInDict, setQueryhSentenceInDict] = useState("");
  const onSearchSentenceInDict = (e) => {
    const query = e.target.value.trim().toLowerCase();
    setQueryhSentenceInDict(query);
  };

  const decorateSentence = (so) => {
    let className;
    if (sentencesInRemoveList.some((stc) => stc.sentence === so.sentence)) {
      className = "text-decoration-line-through text-pink";
    } else if (sentencesInAddList.some((stc) => stc.sentence === so.sentence)) {
      className = "text-blue";
    } else if (sentencesInUnit.some((stc) => stc.sentence === so.sentence)) {
      className = "text-green";
    }
    return className;
  };

  return (
    <>
      {isRemoveSentence.is && (
        <RemoveDeleteModal
          onClose={() => setIsRemoveSentence({ is: false, so: {} })}
          object={isRemoveSentence.so}
          action={"remove"}
          subject={"sentence"}
          bridge={""}
          target={isRemoveSentence.so.sentence}
          onAction={onRemoveSentence}
        />
      )}
      <div className="sm-sentences-in-dict">
        <label
          htmlFor="sm-sentences-in-dict"
          className="label-flexcap mb-2 pointer sm-sentences-in-dict-label"
        >
          Sentences in dictionary
          <BsDash className="ms-1 me-1" /> {sentencesInDict.length}
        </label>
        <div className="sm-transfer">
          <div className="input-group">
            <input
              type="search"
              className="form-control dark-input"
              id="sm-sentences-in-dict"
              placeholder="Search Sentences"
              autoComplete="off"
              value={queryhSentenceInDict}
              ref={querySentenceInDictRef}
              onChange={(e) => onSearchSentenceInDict(e)}
            />
            <button className="input-group-append btn btn-outline-secondary">
              <BsSearch size={"22px"} />
            </button>
          </div>
          <div className="hr" />
          <div className="sm-sentences-in-dict">
            {sentencesInDict.map(
              (so) =>
                so.sentence.toLowerCase().indexOf(queryhSentenceInDict) >
                  -1 && (
                  <div key={so.id}>
                    <div
                      className={`sm-sentence mt-2 mb-2 ${decorateSentence(
                        so
                      )}`}
                    >
                      <div className="sm-sentence-sentence">{so.sentence}</div>
                      {sentenceTail(so)}
                    </div>
                  </div>
                )
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SentencesInDictionary;
