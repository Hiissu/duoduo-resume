import React, { useEffect, useState } from "react";
import { BsDash, BsPlus, BsQuestion, BsTrash, BsX } from "react-icons/bs";
import { connect } from "react-redux";
import { fusion2Texts } from "../../configs/functions";
import { getLanguagesInMeow } from "../../store/actions/language";
import { Modal } from "../Modal";
import { TooltipBasic } from "../Tooltip";
import { UseShortWay } from "../WordModal";
import "./PhraseTranModal.css";

const PhraseTranModal = ({
  po,
  isCreate,
  onAction,
  onClose,
  getLanguagesInMeow,
}) => {
  useEffect(() => {
    var modalCloses = document.querySelectorAll(".ptm-close");
    modalCloses.forEach((modalClose) =>
      modalClose.addEventListener("click", onClose)
    );

    return () => {
      modalCloses.forEach((modalClose) =>
        modalClose.removeEventListener("click", onClose)
      );
    };
  }, []);

  const [languageSpeaking, setLanguageSpeaking] = useState("");
  const [languageLearning, setLanguageLearning] = useState("");

  useEffect(() => {
    (async () => {
      const response = await getLanguagesInMeow();
      setLanguageSpeaking(response.language_speaking);
      setLanguageLearning(response.language_learning);
    })();
  }, [getLanguagesInMeow]);

  const [POS, setPOS] = useState([
    "noun",
    "pronoun",
    "verb",
    "adjective",
    "adverb",
    "preposition",
  ]);
  const [POSelected, setPOSelected] = useState([]);
  const POSFilter = () => POS.filter((os) => !POSelected.some((o) => o === os));

  const trano = () => {
    const posS = POSFilter()[0];
    setPOSelected([...POSelected, posS]);

    return {
      pos: posS,
      definitions: [""],
      meanings: [
        {
          meaning: "",
          reverses: [],
        },
      ],
      note: "",
    };
  };

  const translationo = () => {
    const posS = POSFilter()[0];
    setPOSelected([...POSelected, posS]);

    return {
      image_url: "",
      ipa: "",
      trans: [trano()],
    };
  };

  const translationState = () => {
    if (isCreate) return [translationo()];
    else return po.translation;
  };

  const [translation, setTranslation] = useState(() => translationState());
  const [isCanAction, setIsCanAction] = useState(false);

  const onActionAndClose = () => {
    console.log("onActionAndClose", po.phrase, translation);
    onAction(po, translation);
    onClose();
  };

  const isInvalidTranslation = (tran) => {
    return tran.meanings.some(
      (m) =>
        m.meaning.trim().length < 1 ||
        fusion2Texts(m.meaning).count > 99 ||
        m.reverses.some((rm) => fusion2Texts(rm).count > 99)
    );
  };

  useEffect(() => {
    (() => {
      if (translation.trans.some((tran) => isInvalidTranslation(tran)))
        setIsCanAction(false);
      else {
        const iniTran = po.translation;
        const nowTran = translation;
        if (JSON.stringify(iniTran) !== JSON.stringify(nowTran))
          setIsCanAction(true);
        else setIsCanAction(false);
      }
    })();
  }, [translation]);

  const onChangeInTran = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setTranslation({ ...translation, [name]: value });
  };

  const onAddTran = () => {
    if (POSFilter().length > 0) {
      const newTrans = [...translation.trans, trano()];
      setTranslation({ ...translation, trans: newTrans });
    }
  };

  const onDeleteTran = (os) => {
    if (translation.trans.length > 1) {
      const newTrans = translation.trans.filter((tran) => tran.pos !== os);
      setTranslation({ ...translation, trans: newTrans });
      setPOSelected(POSelected.filter((o) => o !== os));
    }
  };

  const onChangePosNote = (e, os) => {
    const name = e.target.name;
    const value = e.target.value;

    const newTrans = translation.trans.map((tran) =>
      tran.pos === os ? { ...tran, [name]: value } : tran
    );
    setTranslation({ ...translation, trans: newTrans });

    if (name === "pos")
      setPOSelected([...POSelected.filter((o) => o !== os), value]);
  };

  const onAddDefinition = (os) => {
    const newTrans = translation.trans.map((tran) =>
      tran.pos === os && tran.definitions.length < 22
        ? {
            ...tran,
            definitions: [...tran.definitions, ""],
          }
        : tran
    );
    setTranslation({ ...translation, trans: newTrans });
  };

  const onChangeDefinition = (e, os, di) => {
    const value = e.target.value;
    const newTrans = translation.trans.map((tran) =>
      tran.pos === os
        ? {
            ...tran,
            definitions: tran.definitions.map((d, index) =>
              index === di ? value : d
            ),
          }
        : tran
    );
    setTranslation({ ...translation, trans: newTrans });
  };

  const onRemoveDefinition = (os, di) => {
    const newTrans = translation.trans.map((tran) =>
      tran.pos === os
        ? {
            ...tran,
            definitions: tran.definitions.filter(
              (definition, index) => index !== di
            ),
          }
        : tran
    );
    setTranslation({ ...translation, trans: newTrans });
  };

  const onChangeMeaning = (e, os, mi) => {
    const value = e.target.value;
    const newTrans = translation.trans.map((tran) =>
      tran.pos === os
        ? {
            ...tran,
            meanings: tran.meanings.map((m, index) =>
              index === mi ? { ...m, meaning: value } : m
            ),
          }
        : tran
    );
    setTranslation({ ...translation, trans: newTrans });
  };

  const onRemoveMeaning = (os, mi) => {
    const newTrans = translation.trans.map((tran) =>
      tran.pos === os && tran.meanings.length > 1
        ? {
            ...tran,
            meanings: tran.meanings.filter((meaning, index) => index !== mi),
          }
        : tran
    );
    setTranslation({ ...translation, trans: newTrans });
  };

  const onAddMeaning = (os) => {
    const newTrans = translation.trans.map((tran) =>
      tran.pos === os && tran.meanings.length < 22
        ? {
            ...tran,
            meanings: [
              ...tran.meanings,
              {
                meaning: "",
                reverses: [],
              },
            ],
          }
        : tran
    );
    setTranslation({ ...translation, trans: newTrans });
  };

  const onAddReverseMeaning = (os, mi) => {
    const newTrans = translation.trans.map((tran) =>
      tran.pos === os
        ? {
            ...tran,
            meanings: tran.meanings.map((m, index) =>
              index === mi && m.reverses.length < 22
                ? { ...m, reverses: [...m.reverses, ""] }
                : m
            ),
          }
        : tran
    );
    setTranslation({ ...translation, trans: newTrans });
  };

  const onChangeReverseMeaning = (e, os, mi, rmi) => {
    const value = e.target.value;
    const newTrans = translation.trans.map((tran) =>
      tran.pos === os
        ? {
            ...tran,
            meanings: tran.meanings.map((m, index) =>
              index === mi
                ? {
                    ...m,
                    reverses: m.reverses.map((rm, idx) =>
                      idx === rmi ? value : rm
                    ),
                  }
                : m
            ),
          }
        : tran
    );
    setTranslation({ ...translation, trans: newTrans });
  };

  const onRemoveReverseMeaning = (os, mi, rmi) => {
    const newTrans = translation.trans.map((tran) =>
      // && tran.reverses.length > 1
      tran.pos === os
        ? {
            ...tran,
            meanings: tran.meanings.map((m, index) =>
              index === mi
                ? {
                    ...m,
                    reverses: m.reverses.filter((rm, idx) => idx !== rmi),
                  }
                : m
            ),
          }
        : tran
    );
    setTranslation({ ...translation, trans: newTrans });
  };

  const [isUFW, setIsUFW] = useState(false);

  return (
    <Modal isBlackBackDrop={false} onClose={onClose}>
      {isUFW && <UseShortWay onClose={() => setIsUFW(false)}></UseShortWay>}
      <div className="ptm">
        <div className="ptm-container">
          <div className="ptm-header">
            <div className="ptm-close ptm-closer pointer">
              <BsX size={"32px"} />
            </div>
            <div className="ptm-header-title">
              Phrase Translation for <i>{po.phrase}</i>
            </div>
          </div>
          <div className="ptm-content mt-3">
            <div className="form-group">
              <TooltipBasic text={"Image may remind to this word"}>
                <label className="label-cap mb-2" htmlFor="image-url">
                  Image url
                </label>
              </TooltipBasic>
              <input
                type="text"
                className="form-control dark-input"
                id="image-url"
                name="image_url"
                autoComplete="off"
                maxLength="2020"
                value={translation.image_url}
                onChange={(e) => onChangeInTran(e)}
              />
            </div>
            <div className="form-group position-relative">
              <TooltipBasic text={"International Phonetic Alphabet"}>
                <label className="label-cap mb-2" htmlFor="ipa">
                  IPA
                </label>
              </TooltipBasic>
              <textarea
                type="text"
                className="form-control dark-input ptm-ipa-input"
                placeholder="International Phonetic Alphabet"
                autoComplete="off"
                id="ipa"
                maxLength="220"
                value={translation.ipa}
                onChange={(e) => onChangeInTran(e)}
              />
              <span className="num-length">{220 - translation.ipa.length}</span>
            </div>
            <div className="hr" />
            <div className="form-group">
              <label className="label-cap mb-2">
                Trans
                <TooltipBasic text={"Add Tran"}>
                  <span onClick={() => onAddTran()}>
                    <BsPlus className="ms-2 pointer" />
                  </span>
                </TooltipBasic>
              </label>
            </div>
            <div className="ptm-trans mb-3">
              {translation.trans.map((tran, index) => (
                <div className="ptm-translation" key={index}>
                  <label
                    className={`label-cap mb-2 mb-3 ${
                      isInvalidTranslation(tran)
                        ? "text-danger"
                        : "text-success"
                    }`}
                    htmlFor="pos"
                  >
                    Tran with TOP is {tran.pos}
                  </label>
                  <div className="form-group">
                    <div className="ptm-label-with-ques pe-2">
                      <TooltipBasic text={"Type of Phrase"} className={"ms-3"}>
                        <label className="label-cap mb-2" htmlFor="pos">
                          Type of Phrase (TOP)
                        </label>
                      </TooltipBasic>
                      <TooltipBasic text={"Delete"}>
                        <span onClick={() => onDeleteTran(tran.pos)}>
                          <BsTrash className="pointer text-danger" />
                        </span>
                      </TooltipBasic>
                    </div>
                    <select
                      className="form-control form-select dark-input mb-2"
                      id="pos"
                      name="pos"
                      onChange={(e) => onChangePosNote(e, tran.pos)}
                      value={tran.pos}
                    >
                      <option value={tran.pos} defaultValue>
                        {tran.pos}
                      </option>
                      {POSFilter().map((pos, index) => (
                        <option key={index} value={pos}>
                          {pos}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="label-cap mb-2">
                      Definitions
                      <BsDash className="ms-1 me-1" />
                      <TooltipBasic text={"Must < 22"}>
                        <span>{tran.definitions.length}</span>
                      </TooltipBasic>
                      <TooltipBasic text={"Add Definition"}>
                        <span onClick={() => onAddDefinition(tran.pos)}>
                          <BsPlus className="ms-2 me-2 pointer" />
                        </span>
                      </TooltipBasic>
                      <TooltipBasic text={"Use for what ?"}>
                        <span
                          className="pointer p-1"
                          onClick={() => setIsUFW(true)}
                        >
                          <BsQuestion />
                        </span>
                      </TooltipBasic>
                    </label>
                    {tran.definitions.map((d, di) => (
                      <div className="ptm-definition mb-2" key={di}>
                        <textarea
                          type="text"
                          className="form-control dark-input ptm-definition-input"
                          placeholder=""
                          autoComplete="off"
                          name="definition"
                          maxLength="2020"
                          value={d}
                          onChange={(e) => onChangeDefinition(e, tran.pos, di)}
                        />
                        <TooltipBasic text={"Remove"}>
                          <span
                            onClick={() => onRemoveDefinition(tran.pos, di)}
                          >
                            <BsX className="text-danger ms-2 me-2 pointer" />
                          </span>
                        </TooltipBasic>
                      </div>
                    ))}
                  </div>
                  <div className="form-group">
                    <div>
                      <label className="label-cap mb-2">
                        <span
                          className={
                            isInvalidTranslation(tran) ? "text-danger" : ""
                          }
                        >
                          Meanings *<BsDash className="ms-1 me-1" />
                          <TooltipBasic text={"Must < 22"}>
                            <span>{tran.meanings.length}</span>
                          </TooltipBasic>
                        </span>
                        <TooltipBasic text={"Add Meaning"}>
                          <span onClick={() => onAddMeaning(tran.pos)}>
                            <BsPlus className="ms-2 me-2 pointer" />
                          </span>
                        </TooltipBasic>
                        <TooltipBasic text={"Use for what ?"}>
                          <span
                            className="pointer p-1"
                            onClick={() => setIsUFW(true)}
                          >
                            <BsQuestion />
                          </span>
                        </TooltipBasic>
                      </label>
                    </div>
                    <div className="ptm-meanings">
                      {tran.meanings.map((m, mi) => (
                        <div className="ptm-meaning-container mb-3" key={mi}>
                          <div className="ptm-meaning">
                            <textarea
                              type="text"
                              className="form-control dark-input ptm-meaning-input mt-3"
                              placeholder={`Meaning in ${languageSpeaking}`}
                              autoComplete="off"
                              name="meanings"
                              maxLength="2020"
                              value={m.meaning}
                              onChange={(e) => onChangeMeaning(e, tran.pos, mi)}
                            />
                            <TooltipBasic text={"Remove"}>
                              <span
                                onClick={() => onRemoveMeaning(tran.pos, mi)}
                              >
                                <BsX className="text-danger ms-2 me-2 pointer" />
                              </span>
                            </TooltipBasic>
                          </div>
                          <small
                            className={`label-flexcap mt-2 mb-3 ${
                              m.meaning.length > 0 &&
                              fusion2Texts(m.meaning).count < 99
                                ? "text-success"
                                : "text-danger"
                            }`}
                          >
                            Meanings can be
                            <BsDash className="ms-1 me-1" />
                            <TooltipBasic text={"Must < 99"}>
                              <span>
                                {m.meaning.length > 0
                                  ? fusion2Texts(m.meaning).count
                                  : 0}
                              </span>
                            </TooltipBasic>
                          </small>
                          <div className="ptm-convert-meaning">
                            {fusion2Texts(m.meaning).meanings.map((cm, cmi) => (
                              <code key={cmi}>{cm}</code>
                            ))}
                          </div>
                          <div className="hr" />
                          <div className="form-group">
                            <div className="ptm-label-with-ques">
                              <label className="label-cap mb-2">
                                Reverse Meaning
                                <BsDash className="ms-1 me-1" />
                                <TooltipBasic text={"Must < 22"}>
                                  <span>{m.reverses.length}</span>
                                </TooltipBasic>
                                <TooltipBasic text={"Add Reverse Meaning"}>
                                  <span
                                    onClick={() =>
                                      onAddReverseMeaning(tran.pos, mi)
                                    }
                                  >
                                    <BsPlus className="ms-2 me-2 pointer" />
                                  </span>
                                </TooltipBasic>
                                <TooltipBasic text={"Use for what ?"}>
                                  <span
                                    className="pointer p-1"
                                    onClick={() => setIsUFW(true)}
                                  >
                                    <BsQuestion />
                                  </span>
                                </TooltipBasic>
                              </label>
                            </div>
                            <div className="ptm-reverse-meanings">
                              {m.reverses.map((rm, rmi) => (
                                <div
                                  className="ptm-reverse-meaning-container"
                                  key={rmi}
                                >
                                  <div className="ptm-reverse-meaning">
                                    <textarea
                                      type="text"
                                      className="form-control dark-input ptm-reverse-meaning-input"
                                      placeholder={`Reverse meaning in ${languageLearning}`}
                                      autoComplete="off"
                                      name="reverses"
                                      maxLength="2020"
                                      value={rm}
                                      onChange={(e) =>
                                        onChangeReverseMeaning(
                                          e,
                                          tran.pos,
                                          mi,
                                          rmi
                                        )
                                      }
                                    />
                                    <TooltipBasic text={"Remove"}>
                                      <span
                                        onClick={() =>
                                          onRemoveReverseMeaning(
                                            tran.pos,
                                            mi,
                                            rmi
                                          )
                                        }
                                      >
                                        <BsX className="text-danger ms-2 me-2 pointer" />
                                      </span>
                                    </TooltipBasic>
                                  </div>
                                  <small
                                    className={`label-flexcap mt-2 mb-3 ${
                                      // rm.length > 0 &&
                                      fusion2Texts(rm).count < 99
                                        ? ""
                                        : "text-danger"
                                    }`}
                                  >
                                    Reverse meanings can be
                                    <BsDash className="ms-1 me-1" />
                                    <TooltipBasic text={"Must < 99"}>
                                      <span>
                                        {rm.length > 0
                                          ? fusion2Texts(rm).count
                                          : 0}
                                      </span>
                                    </TooltipBasic>
                                  </small>
                                  <div className="ptm-convert-reverse-meaning">
                                    {fusion2Texts(rm).meanings.map(
                                      (crm, crmi) => (
                                        <code key={crmi}>{crm}</code>
                                      )
                                    )}
                                  </div>
                                  {/* <div className="hr" /> */}
                                </div>
                              ))}
                            </div>
                          </div>
                          {/* <div className="hr" /> */}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="form-group position-relative mb-4">
                    <label className="label-cap mb-2" htmlFor="note">
                      Note
                    </label>
                    <textarea
                      type="text"
                      className="form-control dark-input ptm-note-input"
                      placeholder=""
                      autoComplete="off"
                      id="note"
                      name="note"
                      maxLength="220"
                      value={tran.note}
                      onChange={(e) => onChangePosNote(e, tran.pos)}
                    />
                    <span className="num-length">{220 - tran.note.length}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="ptm-footer">
          <div className="btn ptm-close me-3">Cancel</div>
          <button
            className="btn btn-secondary"
            disabled={!isCanAction}
            onClick={() => onActionAndClose()}
          >
            {isCreate ? "Create Translation" : "Save Translation"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { getLanguagesInMeow })(
  PhraseTranModal
);
