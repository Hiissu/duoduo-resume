import React from "react";
import { BsArrowClockwise } from "react-icons/bs";
import { TooltipBasic } from "../../Tooltip";

const UnknownPhrasesWillRemove = ({
  queryPhraseInWill,
  unknownPhrasesInRemoveList,
  onCancelRemoveUnknownPhrase,
}) => {
  return (
    <div className="pm-phrases-will-remove">
      {unknownPhrasesInRemoveList.length > 0 ? (
        unknownPhrasesInRemoveList.map(
          (upo, i) =>
            upo.phrase.toLowerCase().indexOf(queryPhraseInWill) > -1 && (
              <div key={i}>
                <div className="pm-phrase mt-2 mb-2 text-pink">
                  <div className="pm-phrase-phrase">{upo.phrase}</div>
                  <TooltipBasic text={"Cancel Remove"}>
                    <button
                      className="btn btn-outline-secondary text-pink"
                      onClick={() => onCancelRemoveUnknownPhrase(upo)}
                    >
                      <BsArrowClockwise />
                    </button>
                  </TooltipBasic>
                </div>
              </div>
            )
        )
      ) : (
        <div className="text-center">
          <small>None</small>
        </div>
      )}
    </div>
  );
};

export default UnknownPhrasesWillRemove;
