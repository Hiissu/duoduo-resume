import React, { useState } from "react";
import { BsPencil, BsX } from "react-icons/bs";
import { RemoveDeleteModal } from "../../Modal";
import { PhraseTranModal } from "../../PhraseModal";
import { TooltipBasic } from "../../Tooltip";

const UnknownPhrasesWillAdd = ({
  queryPhraseInWill,
  unknownPhrasesInAddList,
  onEditTranOfUnknownPhrase,
  onCancelAddUnknownPhrase,
}) => {
  const [isRemoveUnknownPhrase, setIsRemoveUnknownPhrase] = useState({
    is: false,
    upo: {},
  });

  const [isTransUnknownPhrase, setIsTransUnknownPhrase] = useState({
    is: false,
    ic: false,
    upo: {},
  });

  const onUpdateTran = (po, translation) => {
    onEditTranOfUnknownPhrase(po.phrase, translation);
  };

  return (
    <>
      {isTransUnknownPhrase.is && (
        <PhraseTranModal
          onClose={() =>
            setIsTransUnknownPhrase({ ...isTransUnknownPhrase, is: false })
          }
          po={isTransUnknownPhrase.upo}
          isCreate={isTransUnknownPhrase.ic}
          isUnknown={true}
          onAction={onUpdateTran}
        />
      )}
      {isRemoveUnknownPhrase.is && (
        <RemoveDeleteModal
          onClose={() =>
            setIsRemoveUnknownPhrase({ ...isRemoveUnknownPhrase, is: false })
          }
          po={isRemoveUnknownPhrase.upo}
          object={isRemoveUnknownPhrase.upo}
          action={"remove"}
          subject={"phrase"}
          bridge={""}
          target={isRemoveUnknownPhrase.upo.phrase}
          onAction={onCancelAddUnknownPhrase}
        />
      )}
      <div className="pm-unknown-phrases-will-add">
        {unknownPhrasesInAddList.length > 0 ? (
          unknownPhrasesInAddList.map(
            (upo, i) =>
              upo.phrase.toLowerCase().indexOf(queryPhraseInWill) > -1 && (
                <div key={i}>
                  <div className="pm-phrase mt-2 mb-2 text-blue">
                    <div className="pm-phrase-phrase">{upo.phrase}</div>
                    <TooltipBasic text={"Edit Trans"}>
                      <button
                        className="btn btn-outline-secondary text-blue"
                        onClick={() =>
                          setIsTransUnknownPhrase({
                            is: true,
                            upo: upo,
                            ic: false,
                          })
                        }
                      >
                        <BsPencil />
                      </button>
                    </TooltipBasic>
                    <TooltipBasic className={"ms-1"} text={"Cancel Add"}>
                      <button
                        className="btn btn-outline-secondary text-blue"
                        onClick={() =>
                          setIsRemoveUnknownPhrase({ is: true, upo: upo })
                        }
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
    </>
  );
};

export default UnknownPhrasesWillAdd;
