import React, { useEffect, useRef, useState } from "react";
import { BsArrowClockwise, BsDash, BsSearch, BsX } from "react-icons/bs";
import { RemoveDeleteModal } from "../../Modal";
import { TooltipBasic } from "../../Tooltip";

const PhrasesInUnit = ({
  phrasesInUnit,
  phrasesInRemoveList,
  onRemovePhrase,
  onCancelRemovePhrase,
}) => {
  const queryPhraseRef = useRef();
  useEffect(() => {
    queryPhraseRef.current.focus();
  }, []);

  const [queryPhrase, setQueryPhrase] = useState("");
  const onSearchPhraseInDict = (e) => {
    const query = e.target.value.trim().toLowerCase();
    setQueryPhrase(query);
  };

  const [isRemovePhrase, setIsRemovePhrase] = useState({ is: false, po: {} });

  const phraseTail = (po) => {
    if (phrasesInRemoveList.some((phr) => phr.id === po.id)) {
      return (
        <TooltipBasic text={"Cancel Remove"}>
          <button
            className="btn btn-outline-secondary text-pink"
            onClick={() => onCancelRemovePhrase(po)}
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
            onClick={() => setIsRemovePhrase({ is: true, po: po })}
          >
            <BsX />
          </button>
        </TooltipBasic>
      );
    }
  };

  const decoratePhrase = (po) => {
    let className;
    if (phrasesInRemoveList.some((phr) => phr.id === po.id)) {
      className = "text-decoration-line-through text-pink";
    } else {
      className = "text-green";
    }
    return className;
  };

  return (
    <>
      {isRemovePhrase.is && (
        <RemoveDeleteModal
          onClose={() => setIsRemovePhrase({ ...isRemovePhrase, is: false })}
          object={isRemovePhrase.po}
          action={"remove"}
          subject={"phrase"}
          bridge={""}
          target={isRemovePhrase.po.phrase}
          onAction={onRemovePhrase}
        />
      )}
      <label className="label-cap mb-2">
        Phrases in unit
        <BsDash className="ms-1 me-1" />
        {phrasesInUnit.length}
      </label>
      <div className="input-group">
        <input
          type="search"
          className="form-control dark-input"
          placeholder="Search Phrases"
          autoComplete="off"
          value={queryPhrase}
          ref={queryPhraseRef}
          onChange={(e) => onSearchPhraseInDict(e)}
        />
        <button className="input-group-append btn btn-outline-secondary">
          <BsSearch size={"22px"} />
        </button>
      </div>
      <div className="hr" />
      <div className="pm-phrases-in-unit">
        {phrasesInUnit.length > 0 ? (
          phrasesInUnit.map(
            (po) =>
              po.phrase.toLowerCase().indexOf(queryPhrase) > -1 && (
                <div key={po.id}>
                  <div className={`pm-phrase mt-2 mb-2 ${decoratePhrase(po)}`}>
                    <div className="pm-phrase-phrase">{po.phrase}</div>
                    {phraseTail(po)}
                  </div>
                </div>
              )
          )
        ) : (
          <div className="text-center">No phrases available</div>
        )}
      </div>
    </>
  );
};

export default PhrasesInUnit;
