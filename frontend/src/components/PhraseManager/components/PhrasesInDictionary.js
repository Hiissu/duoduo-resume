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

const PhrasesInDictionary = ({
  phrasesInDict,
  phrasesInUnit,
  // ~> for phrasesInAddList
  phrasesInAddList,
  onAddPhrase,
  onCancelAddPhrase,
  // ~> for phrasesInRemoveList
  phrasesInRemoveList,
  onRemovePhrase,
  onCancelRemovePhrase,
}) => {
  const queryPhraseInDictRef = useRef();
  useEffect(() => {
    queryPhraseInDictRef.current.focus();
  }, []);

  const [isRemovePhrase, setIsRemovePhrase] = useState({ is: false, po: {} });

  const phraseTail = (po) => {
    if (phrasesInAddList.some((phr) => phr.id === po.id)) {
      return (
        <TooltipBasic text={"Cancel Add"}>
          <button
            className="btn btn-outline-secondary text-blue"
            onClick={() => onCancelAddPhrase(po)}
          >
            <BsArrowClockwise />
          </button>
        </TooltipBasic>
      );
    } else if (phrasesInRemoveList.some((phr) => phr.id === po.id)) {
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
    } else if (phrasesInUnit.some((phr) => phr.id === po.id)) {
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
    } else {
      return (
        <TooltipBasic text={"Add"}>
          <button
            className="btn btn-outline-secondary"
            onClick={() => onAddPhrase(po)}
          >
            <BsPlus />
          </button>
        </TooltipBasic>
      );
    }
  };

  //  remove hr and add effect hover phrases
  const [queryhPhraseInDict, setQueryhPhraseInDict] = useState("");
  const onSearchPhraseInDict = (e) => {
    const query = e.target.value.trim().toLowerCase();
    setQueryhPhraseInDict(query);
  };

  const decoratePhrase = (po) => {
    let className;
    if (phrasesInRemoveList.some((phr) => phr.phrase === po.phrase)) {
      className = "text-decoration-line-through text-pink";
    } else if (phrasesInAddList.some((phr) => phr.phrase === po.phrase)) {
      className = "text-blue";
    } else if (phrasesInUnit.some((phr) => phr.phrase === po.phrase)) {
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
      <div className="pm-phrases-in-dict">
        <label
          htmlFor="pm-phrases-in-dict"
          className="label-flexcap mb-2 pointer pm-phrases-in-dict-label"
        >
          Phrases in dictionary
          <BsDash className="ms-1 me-1" />
          {phrasesInDict.length}
        </label>
        <div className="pm-transfer">
          <div className="input-group">
            <input
              type="search"
              className="form-control dark-input"
              id="pm-phrases-in-dict"
              placeholder="Search Phrases"
              autoComplete="off"
              value={queryhPhraseInDict}
              ref={queryPhraseInDictRef}
              onChange={(e) => onSearchPhraseInDict(e)}
            />
            <button className="input-group-append btn btn-outline-secondary">
              <BsSearch size={"22px"} />
            </button>
          </div>
          <div className="hr" />
          <div className="pm-phrases-in-dict">
            {phrasesInDict.map(
              (po) =>
                po.phrase.toLowerCase().indexOf(queryhPhraseInDict) > -1 && (
                  <div key={po.id}>
                    <div
                      className={`pm-phrase mt-2 mb-2 ${decoratePhrase(po)}`}
                    >
                      <div className="pm-phrase-phrase">{po.phrase}</div>
                      {phraseTail(po)}
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

export default PhrasesInDictionary;
