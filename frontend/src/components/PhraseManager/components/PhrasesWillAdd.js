import React from "react";
import { BsX } from "react-icons/bs";
import { TooltipBasic } from "../../Tooltip";

const PhrasesWillAdd = ({
  queryPhraseInWill,
  phrasesInAddList,
  onCancelAddPhrase,
}) => {
  return (
    <div className="pm-phrases-will-add">
      {phrasesInAddList.length > 0 ? (
        phrasesInAddList.map(
          (po) =>
            po.phrase.toLowerCase().indexOf(queryPhraseInWill) > -1 && (
              <div key={po.id}>
                <div className="pm-phrase mt-2 mb-2 text-blue">
                  <div className="pm-phrase-phrase">{po.phrase}</div>
                  <TooltipBasic text={"Cancel Add"}>
                    <button
                      className="btn btn-outline-secondary text-blue"
                      onClick={() => onCancelAddPhrase(po)}
                    >
                      <BsX />
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

export default PhrasesWillAdd;
