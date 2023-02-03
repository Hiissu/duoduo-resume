import React from "react";
import { BsArrowClockwise } from "react-icons/bs";
import { TooltipBasic } from "../../Tooltip";

const PhrasesWillRemove = ({
  queryPhraseInWill,
  phrasesInRemoveList,
  onCancelRemovePhrase,
}) => {
  return (
    <div className="pm-phrases-will-remove">
      {phrasesInRemoveList.length > 0 ? (
        phrasesInRemoveList.map(
          (po) =>
            po.phrase.toLowerCase().indexOf(queryPhraseInWill) > -1 && (
              <div key={po.id}>
                <div className="pm-phrase mt-2 mb-2 text-pink">
                  <div className="pm-phrase-phrase">{po.phrase}</div>
                  <TooltipBasic text={"Cancel Remove"}>
                    <button
                      className="btn btn-outline-secondary text-pink"
                      onClick={() => onCancelRemovePhrase(po)}
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

export default PhrasesWillRemove;
