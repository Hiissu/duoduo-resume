import React, { useEffect, useRef, useState } from "react";
import { BsArrowClockwise, BsDash, BsSearch, BsX } from "react-icons/bs";
import { RemoveDeleteModal } from "../../Modal";
import { TooltipBasic } from "../../Tooltip";

const UnknownPhrasesInUnit = ({
  unknownPhrasesInUnit,
  unknownPhrasesInRemoveList,
  onRemoveUnknownPhrase,
  onCancelRemoveUnknownPhrase,
}) => {
  const queryUnknownPhraseRef = useRef();
  useEffect(() => {
    queryUnknownPhraseRef.current.focus();
  }, []);

  const [queryUnknownPhrase, setQueryUnknownPhrase] = useState("");
  const onSearchPhraseInDict = (e) => {
    const query = e.target.value.trim().toLowerCase();
    setQueryUnknownPhrase(query);
  };

  const [isRemoveUnknownPhrase, setIsRemoveUnknownPhrase] = useState({
    is: false,
    upo: {},
  });

  const phraseTail = (upo) => {
    if (unknownPhrasesInRemoveList.some((phr) => phr.id === upo.id)) {
      return (
        <TooltipBasic text={"Cancel Remove"}>
          <button
            className="btn btn-outline-secondary text-pink"
            onClick={() => onCancelRemoveUnknownPhrase(upo)}
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
            onClick={() => setIsRemoveUnknownPhrase({ is: true, upo: upo })}
          >
            <BsX />
          </button>
        </TooltipBasic>
      );
    }
  };

  const decoratePhrase = (upo) => {
    let className;
    if (unknownPhrasesInRemoveList.some((phr) => phr.id === upo.id)) {
      className = "text-decoration-line-through text-pink";
    } else {
      className = "text-green";
    }
    return className;
  };

  return (
    <>
      {isRemoveUnknownPhrase.is && (
        <RemoveDeleteModal
          onClose={() =>
            setIsRemoveUnknownPhrase({ ...isRemoveUnknownPhrase, is: false })
          }
          object={isRemoveUnknownPhrase.upo}
          action={"remove"}
          subject={"phrase"}
          bridge={""}
          target={isRemoveUnknownPhrase.upo.phrase}
          onAction={onRemoveUnknownPhrase}
        />
      )}
      <label className="label-flexcap mb-2 pointer">
        Unknown Phrases in unit
        <BsDash className="ms-1 me-1" />
        {unknownPhrasesInUnit.length}
      </label>
      <div className="input-group">
        <input
          type="search"
          className="form-control dark-input"
          placeholder="Search Phrases"
          autoComplete="off"
          value={queryUnknownPhrase}
          ref={queryUnknownPhraseRef}
          onChange={(e) => onSearchPhraseInDict(e)}
        />
        <button className="input-group-append btn btn-outline-secondary">
          <BsSearch size={"22px"} />
        </button>
      </div>
      <div className="hr" />
      <div className="pm-phrases-in-unit">
        {unknownPhrasesInUnit.length > 0 ? (
          unknownPhrasesInUnit.map(
            (upo, i) =>
              upo.phrase.toLowerCase().indexOf(queryUnknownPhrase) > -1 && (
                <div key={i}>
                  <div className={`pm-phrase mt-2 mb-2 ${decoratePhrase(upo)}`}>
                    <div className="pm-phrase-phrase">{upo.phrase}</div>
                    {phraseTail(upo)}
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

export default UnknownPhrasesInUnit;
