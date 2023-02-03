import React, { useEffect, useRef, useState } from "react";
import { BsArrowClockwise, BsDash, BsSearch, BsX } from "react-icons/bs";
import { RemoveDeleteModal } from "../../Modal";
import { TooltipBasic } from "../../Tooltip";

const UnknownSentencesInUnit = ({
  unknownSentencesInUnit,
  unknownSentencesInRemoveList,
  onRemoveUnknownSentence,
  onCancelRemoveUnknownSentence,
}) => {
  const queryUnknownSentenceRef = useRef();
  useEffect(() => {
    queryUnknownSentenceRef.current.focus();
  }, []);

  const [queryUnknownSentence, setQueryUnknownSentence] = useState("");
  const onSearchSentenceInDict = (e) => {
    const query = e.target.value.trim().toLowerCase();
    setQueryUnknownSentence(query);
  };

  const [isRemoveUnknownSentence, setIsRemoveUnknownSentence] = useState({
    is: false,
    uso: {},
  });

  const sentenceTail = (uso) => {
    if (unknownSentencesInRemoveList.some((stc) => stc.id === uso.id)) {
      return (
        <TooltipBasic text={"Cancel Remove"}>
          <button
            className="btn btn-outline-secondary text-pink"
            onClick={() => onCancelRemoveUnknownSentence(uso)}
          >
            <BsArrowClockwise />
          </button>
        </TooltipBasic>
      );
    } else {
      return (
        <TooltipBasic text={"Remove"}>
          <button
            className="btn btn-outline-secondary text-green"
            onClick={() => setIsRemoveUnknownSentence({ is: true, uso: uso })}
          >
            <BsX />
          </button>
        </TooltipBasic>
      );
    }
  };

  const decorateSentence = (uso) => {
    let className;
    if (unknownSentencesInRemoveList.some((stc) => stc.id === uso.id)) {
      className = "text-decoration-line-through text-pink";
    } else {
      className = "text-green";
    }
    return className;
  };

  return (
    <>
      {isRemoveUnknownSentence.is && (
        <RemoveDeleteModal
          onClose={() => setIsRemoveUnknownSentence({ is: false, uso: {} })}
          object={isRemoveUnknownSentence.uso}
          action={"remove"}
          subject={"sentence"}
          bridge={""}
          target={isRemoveUnknownSentence.uso.sentence}
          onAction={onRemoveUnknownSentence}
        />
      )}
      <label className="label-flexcap mb-2 pointer">
        Unknown Sentences in unit
        <BsDash className="ms-1 me-1" />
        {unknownSentencesInUnit.length}
      </label>
      <div className="input-group">
        <input
          type="search"
          className="form-control dark-input"
          placeholder="Search Sentences"
          autoComplete="off"
          value={queryUnknownSentence}
          ref={queryUnknownSentenceRef}
          onChange={(e) => onSearchSentenceInDict(e)}
        />
        <button className="input-group-append btn btn-outline-secondary">
          <BsSearch size={"22px"} />
        </button>
      </div>
      <div className="hr" />
      <div className="sm-sentences-in-unit">
        {unknownSentencesInUnit.length > 0 ? (
          unknownSentencesInUnit.map(
            (uso, i) =>
              uso.sentence.toLowerCase().indexOf(queryUnknownSentence) > -1 && (
                <div key={i}>
                  <div
                    className={`sm-sentence mt-2 mb-2 ${decorateSentence(uso)}`}
                  >
                    <div className="sm-sentence-sentence">{uso.sentence}</div>
                    {sentenceTail(uso)}
                  </div>
                </div>
              )
          )
        ) : (
          <div className="text-center">No sentences available</div>
        )}
      </div>
    </>
  );
};

export default UnknownSentencesInUnit;
