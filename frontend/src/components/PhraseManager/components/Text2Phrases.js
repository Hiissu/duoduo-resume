import React, { useEffect, useRef, useState } from "react";
import {
  BsArrowClockwise,
  BsCloudHaze,
  BsCloudHaze2Fill,
  BsDash,
  BsPencil,
  BsPlus,
  BsQuestionCircle,
  BsSearch,
  BsX,
} from "react-icons/bs";
import { RemoveDeleteModal } from "../../Modal";
import { PhraseTranModal } from "../../PhraseModal";
import { magicSVG } from "../../SVGs";
import { TooltipBasic } from "../../Tooltip";

const Text2Phrases = ({
  text2meow,
  setText2Meow,
  phrasesInDict,
  phrasesInUnit,
  unknownPhrasesInUnit,
  // ~> for phrasesInAddList
  phrasesInAddList,
  onAddPhrase,
  onCancelAddPhrase,
  // ~> for phrasesInRemoveList
  phrasesInRemoveList,
  onRemovePhrase,
  onCancelRemovePhrase,
  // ~> for unknownPhrasesInAddList
  unknownPhrasesInAddList,
  onAddUnknownPhrase,
  onCancelAddUnknownPhrase,
  onEditTranOfUnknownPhrase,
  // ~> for unknownPhrasesInRemoveList
  unknownPhrasesInRemoveList,
  onRemoveUnknownPhrase,
  onCancelRemoveUnknownPhrase,
  // ~> for detect phrases
  phrasesInDetectedList,
  setPhrasesInDetectedList,
  phrasesInUnknownList,
  setPhrasesInUnknownList,
}) => {
  const [text2phrases, setText2Phrases] = useState(text2meow);
  const text2phrasesRef = useRef();

  // re-onText2Phrases after load phrasesInDict
  useEffect(() => {
    text2phrasesRef.current.focus();
    onText2Phrases();
  }, [phrasesInDict]);

  useEffect(() => {
    onText2Phrases();
  }, [text2phrases]);

  /* regex stuffs
    /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    /[`~@#$%^&*()_|\n|+\-—=;:’'"“”<>\r\n\{\}\[\]\\\/]/gi
  
    /^[\p{L}\p{N}\p{M} ]+$/u    
    /[\p{Letter}\p{Mark}\s-]+/gu   
    /[\p{Letter}\p{Mark}]+/gu       ~     \p{L} {Letter}  \p{M} {Mark}  \p{N} {Numeric}
    
    const regextForAllLangs = /^[\p{L}\p{M} ]+$/u      
    regextForAllLangs.test(string)
  */

  const [phrasesWithIndexes, setPhrasesWithIndexes] = useState([]);
  const onText2Phrases = () => {
    let phrasesInText = [];
    const regex = `[]\`|/~!@#$%^&*()_+-—=?;:’'"“”,.。<>{}`;
    const regexArray = regex.split("");

    for (let o = 0, s = 0, e = 0, l = text2phrases.length; o < l; o++) {
      if (regexArray.indexOf(text2phrases[o]) > -1) {
        phrasesInText.push({
          phrase: text2phrases.substring(s, o).trim(),
          indexes: [{ start: s, end: o }],
        });

        s = o + 1;
        e = o + 1;
      }

      // add the rest
      if (o === l - 1) {
        if (s < l) {
          const theRest = text2phrases.substring(s, l).trim();
          if (theRest.length > 0) {
            phrasesInText.push({
              phrase: theRest,
              indexes: [{ start: s, end: l }],
            });
          }
        }
      }
    }

    let newPhrasesInText = [];
    // remove phrase and combine indexes if duplicate
    phrasesInText.forEach((phr) => {
      if (phr.phrase.trim().length > 0) {
        if (!newPhrasesInText.some((ele) => ele.phrase === phr.phrase)) {
          newPhrasesInText.push(phr);
        } else {
          newPhrasesInText.forEach((ele) => {
            if (ele.phrase === phr.phrase) {
              ele.indexes = [...ele.indexes, ...phr.indexes];
            }
          });
        }
      }
    });

    let phrasesDetected = [];
    let unknownPhrases = [];

    newPhrasesInText.forEach((pito) => {
      let idx = phrasesInDict.findIndex((po) => po.phrase === pito.phrase);
      if (idx > -1) phrasesDetected.push(phrasesInDict[idx]);
      else
        unknownPhrases.push({
          phrase: pito.phrase,
          translation: {
            image_url: "",
            ipa: "",
            trans: [
              {
                pos: "noun",
                definitions: [""],
                meanings: [
                  {
                    meaning: "",
                    reverses: [],
                  },
                ],
                note: "",
              },
            ],
          },
        });
    });

    setPhrasesWithIndexes(newPhrasesInText);
    setPhrasesInDetectedList(phrasesDetected);
    setPhrasesInUnknownList(unknownPhrases);
  };

  const onChangeText2Phrases = (e) => {
    const text = e.target.value;
    setText2Phrases(text);
  };

  const onSave2Meow = () => {
    setText2Meow(text2phrases);
  };

  const [queryMeow, setQueryMeow] = useState("");
  const onChangeQueryMeow = (e) => {
    const query = e.target.value.trim().toLowerCase();
    setQueryMeow(query);
  };

  const indexesOf = (phrase) => {
    const phrFound = phrasesWithIndexes.find((ele) => ele.phrase === phrase);
    return phrFound.indexes;
  };

  const prevIndexesRef = useRef({ obj: "", indexa: [], lasti: 0 });
  const onClickPhrase = (phrase) => {
    let selectionStart, selectionEnd;
    phrasesWithIndexes.forEach((ele) => {
      if (ele.phrase === phrase) {
        const firstIndex = ele.indexes[0];
        selectionStart = firstIndex.start;
        selectionEnd = firstIndex.end;
      }
    });

    const currentIndexes = prevIndexesRef.current;
    // check is the same object ~> true ~ index > 0
    const isIndexIn = currentIndexes.indexa.indexOf(selectionStart) > -1;
    const currentLength = currentIndexes.indexa.length;
    if (isIndexIn) {
      if (currentIndexes.lasti < currentLength - 1) {
        // -> moving to next index
        const nextIndex = currentIndexes.indexa[currentIndexes.lasti + 1];
        selectionStart = nextIndex.start;
        selectionEnd = nextIndex.end;

        prevIndexesRef.current = {
          ...currentIndexes,
          lasti: currentIndexes.lasti + 1,
        };
      } else
        prevIndexesRef.current = {
          ...currentIndexes,
          lasti: 0,
        };
    } else {
      const indexes = indexesOf(phrase);
      prevIndexesRef.current = { obj: phrase, indexa: indexes, lasti: 0 };
    }

    // or maybe scroll work with .set -> .blur -> .focus
    text2phrasesRef.current.setSelectionRange(selectionStart, selectionStart);
    text2phrasesRef.current.focus();
    text2phrasesRef.current.setSelectionRange(selectionStart, selectionEnd);
  };

  const [isRemovePhrase, setIsRemovePhrase] = useState({ is: false, po: {} });
  const [isRemoveUnknownPhrase, setIsRemoveUnknownPhrase] = useState({
    is: false,
    ica: true,
    upo: {},
  });
  const [isTranUnknownPhrase, setIsTranUnknownPhrase] = useState({
    is: false,
    ic: true,
    upo: {},
  });

  const onDisplayPhrasesInDetectedList = () => {
    const phraseTail = (pidl) => {
      if (phrasesInAddList.some((phr) => phr.phrase === pidl.phrase)) {
        return (
          <TooltipBasic text={"Cancel Add"}>
            <button
              className="btn btn-outline-secondary text-blue"
              onClick={() => onCancelAddPhrase(pidl)}
            >
              <BsArrowClockwise />
            </button>
          </TooltipBasic>
        );
      } else if (
        phrasesInRemoveList.some((phr) => phr.phrase === pidl.phrase)
      ) {
        return (
          <TooltipBasic text={"Cancel Remove"}>
            <button
              className="btn btn-outline-secondary text-pink"
              onClick={() => onCancelRemovePhrase(pidl)}
            >
              <BsArrowClockwise />
            </button>
          </TooltipBasic>
        );
      } else if (phrasesInUnit.some((phr) => phr.phrase === pidl.phrase)) {
        return (
          <TooltipBasic text={"Remove"}>
            <button
              className="btn btn-outline-secondary text-green"
              onClick={() => setIsRemovePhrase({ is: true, po: pidl })}
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
              onClick={() => onAddPhrase(pidl)}
            >
              <BsPlus />
            </button>
          </TooltipBasic>
        );
      }
    };

    const decoratePhrase = (pidl) => {
      let className;
      if (phrasesInRemoveList.some((phr) => phr.phrase === pidl.phrase)) {
        className = "text-decoration-line-through text-pink";
      } else if (phrasesInAddList.some((phr) => phr.phrase === pidl.phrase)) {
        className = "text-blue";
      } else if (phrasesInUnit.some((phr) => phr.phrase === pidl.phrase)) {
        className = "text-green";
      }
      return className;
    };

    return (
      <>
        {phrasesInDetectedList.length > 0 ? (
          phrasesInDetectedList.map(
            (pidl, i) =>
              pidl.phrase.toLowerCase().indexOf(queryMeow) > -1 && (
                <div
                  key={i}
                  className={`pm-phrase mt-2 mb-2 ${decoratePhrase(pidl)}`}
                >
                  <div
                    className="pm-phrase-phrase"
                    onClick={() => onClickPhrase(pidl.phrase)}
                  >
                    {pidl.phrase}
                  </div>
                  <TooltipBasic text={"Times Display"}>
                    <small className="pm-phrase-num-times-display">
                      <BsX size={"12px"} />
                      {indexesOf(pidl.phrase).length}
                    </small>
                  </TooltipBasic>
                  {phraseTail(pidl)}
                </div>
              )
          )
        ) : (
          <div className="text-center mt-3">No phrase available</div>
        )}
      </>
    );
  };

  const onDisplayPhrasesInUnknownList = () => {
    const phraseTail = (piul) => {
      if (unknownPhrasesInAddList.some((phr) => phr.phrase === piul.phrase)) {
        return (
          <>
            <TooltipBasic text={"Edit Translation"}>
              <button
                className="btn btn-outline-secondary text-blue"
                onClick={() =>
                  setIsTranUnknownPhrase({
                    is: true,
                    ic: false,
                    upo: piul,
                  })
                }
              >
                <BsPencil />
              </button>
            </TooltipBasic>
            <TooltipBasic text={"Cancel Add"}>
              <button
                className="btn btn-outline-secondary text-blue"
                onClick={() =>
                  setIsRemoveUnknownPhrase({ is: true, ica: true, upo: piul })
                }
              >
                <BsArrowClockwise />
              </button>
            </TooltipBasic>
          </>
        );
      } else if (
        unknownPhrasesInRemoveList.some((phr) => phr.phrase === piul.phrase)
      ) {
        return (
          <TooltipBasic text={"Cancel Remove"}>
            <button
              className="btn btn-outline-secondary text-pink"
              onClick={() => onCancelRemoveUnknownPhrase(piul)}
            >
              <BsArrowClockwise />
            </button>
          </TooltipBasic>
        );
      } else if (
        unknownPhrasesInUnit.some((phr) => phr.phrase === piul.phrase)
      ) {
        return (
          <TooltipBasic text={"Remove"}>
            <button
              className="btn btn-outline-secondary text-green"
              onClick={() =>
                setIsRemoveUnknownPhrase({ is: true, ica: false, upo: piul })
              }
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
              onClick={() =>
                setIsTranUnknownPhrase({ is: true, ic: true, upo: piul })
              }
            >
              <BsPlus />
            </button>
          </TooltipBasic>
        );
      }
    };

    const decorateUnknowPhrase = (piul) => {
      let className;
      if (
        unknownPhrasesInRemoveList.some((phr) => phr.phrase === piul.phrase)
      ) {
        className = "text-decoration-line-through text-pink";
      } else if (
        unknownPhrasesInAddList.some((phr) => phr.phrase === piul.phrase)
      ) {
        className = "text-blue";
      } else if (
        unknownPhrasesInUnit.some((phr) => phr.phrase === piul.phrase)
      ) {
        className = "text-green";
      }
      return className;
    };

    return (
      <>
        {phrasesInUnknownList.length > 0 ? (
          phrasesInUnknownList.map(
            (piul, i) =>
              piul.phrase.toLowerCase().indexOf(queryMeow) > -1 && (
                <div
                  key={i}
                  className={`pm-phrase mt-2 mb-2 ${decorateUnknowPhrase(
                    piul
                  )}`}
                >
                  <div
                    className="pm-phrase-phrase"
                    onClick={() => onClickPhrase(piul.phrase)}
                  >
                    {piul.phrase}
                  </div>
                  <TooltipBasic text={"Times Display"}>
                    <small className="pm-phrase-num-times-display">
                      <BsX size={"12px"} />
                      {indexesOf(piul.phrase).length}
                    </small>
                  </TooltipBasic>
                  {phraseTail(piul)}
                </div>
              )
          )
        ) : (
          <div className="text-center mt-3">No phrase available</div>
        )}
      </>
    );
  };

  const onUpdateTran = (po, translation) => {
    onEditTranOfUnknownPhrase(po.phrase, translation);
  };

  const onCreateTran = (po, translation) => {
    onAddUnknownPhrase({ phrase: po.phrase, translation: translation });
  };

  const [isWhat, setIsWhat] = useState(true);

  return (
    <>
      {isTranUnknownPhrase.is && (
        <PhraseTranModal
          onClose={() =>
            setIsTranUnknownPhrase({ ...isTranUnknownPhrase, is: false })
          }
          po={isTranUnknownPhrase.upo}
          isCreate={isTranUnknownPhrase.ic}
          isUnknown={true}
          onAction={isTranUnknownPhrase.ic ? onCreateTran : onUpdateTran}
        />
      )}
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
          onAction={
            isRemoveUnknownPhrase.ica
              ? onCancelAddUnknownPhrase
              : onRemoveUnknownPhrase
          }
        />
      )}
      <div className="pm-text2phrases">
        <label
          htmlFor="pm-text2phrases-input"
          className="label-cap mb-2 pm-text2phrases-label"
        >
          Text to Phrases
        </label>
        <div className="pm-transfer">
          <div className="pm-text2phrases-wrapper">
            <textarea
              type="text"
              className="form-control dark-input pm-text2phrases-input mb-2"
              id="pm-text2phrases-input"
              placeholder="Enter your text"
              autoComplete="off"
              ref={text2phrasesRef}
              value={text2phrases}
              onChange={(e) => onChangeText2Phrases(e)}
            />
            <small>
              {magicSVG(16, "ms-2 me-2")}
              Use ( comma , ) to separate phrases
            </small>
            <small className="ms-4 pointer" onClick={() => onSave2Meow()}>
              {text2meow !== text2phrases ? (
                <BsCloudHaze className="ms-2 me-2" />
              ) : (
                <BsCloudHaze2Fill className="ms-2 me-2" />
              )}
              Save changes
            </small>
            <div className="input-group mt-2">
              <input
                type="search"
                className="form-control dark-input"
                placeholder="Search Phrases"
                autoComplete="off"
                value={queryMeow}
                onChange={(e) => onChangeQueryMeow(e)}
              />
              <button className="input-group-append btn btn-outline-secondary">
                <BsSearch size={"22px"} />
              </button>
            </div>
          </div>
          <div className="hr" />
          <div className="pm-transfer-detail">
            <div className="form-group">
              <label
                htmlFor="phrases-detected-input"
                className="label-flexcap mb-2 pointer"
                onClick={() => setIsWhat(!isWhat)}
              >
                Phrases detected
                <BsDash className="ms-1 me-1" />
                {phrasesInDetectedList.length}
              </label>
              {isWhat === true && (
                <>
                  <div className="pm-phrases-detected">
                    {onDisplayPhrasesInDetectedList()}
                  </div>
                </>
              )}
            </div>
            <div className="hr" />
            <div className="form-group">
              <label
                htmlFor="unknown-phrases-input"
                className="label-flexcap mb-2 pointer"
                onClick={() => setIsWhat(!isWhat)}
              >
                Unknown phrases
                <BsDash className="ms-1 me-1" />
                {phrasesInUnknownList.length}
                <TooltipBasic
                  text={"Phrases are not available in our dictionary yet"}
                >
                  <BsQuestionCircle size={"22px"} className="ms-2" />
                </TooltipBasic>
              </label>
              {isWhat === false && (
                <div className="pm-unknown-phrases">
                  {onDisplayPhrasesInUnknownList()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Text2Phrases;
