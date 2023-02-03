import React, { useEffect, useRef, useState } from "react";
import { BsArrowClockwise, BsDash, BsSearch, BsX } from "react-icons/bs";
import { RemoveDeleteModal } from "../../Modal";
import { TooltipBasic } from "../../Tooltip";

const SentencesInUnit = ({
  sentencesInUnit,
  sentencesInRemoveList,
  onRemoveSentence,
  onCancelRemoveSentence,
}) => {
  const querySentenceRef = useRef();
  useEffect(() => {
    querySentenceRef.current.focus();
  }, []);

  const [querySentence, setQuerySentence] = useState("");
  const onSearchSentenceInDict = (e) => {
    const query = e.target.value.trim().toLowerCase();
    setQuerySentence(query);
  };

  const [isRemoveSentence, setIsRemoveSentence] = useState({
    is: false,
    so: {},
  });

  const sentenceTail = (so) => {
    if (sentencesInRemoveList.some((stc) => stc.id === so.id)) {
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
    } else {
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
    }
  };

  const decorateSentence = (so) => {
    let className;
    if (sentencesInRemoveList.some((stc) => stc.id === so.id)) {
      className = "text-decoration-line-through text-pink";
    } else {
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
      <label className="label-cap mb-2">
        Sentences in unit
        <BsDash className="ms-1 me-1" />
        {sentencesInUnit.length}
      </label>
      <div className="input-group">
        <input
          type="search"
          className="form-control dark-input"
          placeholder="Search Sentences"
          autoComplete="off"
          value={querySentence}
          ref={querySentenceRef}
          onChange={(e) => onSearchSentenceInDict(e)}
        />
        <button className="input-group-append btn btn-outline-secondary">
          <BsSearch size={"22px"} />
        </button>
      </div>
      <div className="hr" />
      <div className="sm-sentences-in-unit">
        {sentencesInUnit.length > 0 ? (
          sentencesInUnit.map(
            (so) =>
              so.sentence.toLowerCase().indexOf(querySentence) > -1 && (
                <div key={so.id}>
                  <div
                    className={`sm-sentence mt-2 mb-2 ${decorateSentence(so)}`}
                  >
                    <div className="sm-sentence-sentence">{so.sentence}</div>
                    {sentenceTail(so)}
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

export default SentencesInUnit;
