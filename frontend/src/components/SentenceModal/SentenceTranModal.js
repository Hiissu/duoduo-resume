import React, { useEffect, useState } from "react";
import { BsDash, BsPlus, BsQuestion, BsX } from "react-icons/bs";
import { connect } from "react-redux";
import { fusion2Texts } from "../../configs/functions";
import { getLanguagesInMeow } from "../../store/actions/language";
import { Modal } from "../Modal";
import { TooltipBasic } from "../Tooltip";
import { UseShortWay } from "../WordModal";
import "./SentenceTranModal.css";

const SentenceTranModal = ({
  so,
  isCreate,
  onAction,
  onClose,
  getLanguagesInMeow,
}) => {
  useEffect(() => {
    var modalCloses = document.querySelectorAll(".stm-close");
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

  const translationo = () => {
    return {
      image_url: "",
      ipa: "",
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

  const translationState = () => {
    if (isCreate) return [translationo()];
    else return so.translation;
  };

  const [translation, setTranslation] = useState(() => translationState());
  const [isCanAction, setIsCanAction] = useState(false);

  const onActionAndClose = () => {
    console.log("onActionAndClose", so.sentence, translation);
    onAction(so, translation);
    onClose();
  };

  const isInvalidTranslation = () => {
    return translation.meanings.some(
      (m) =>
        m.meaning.trim().length < 1 ||
        fusion2Texts(m.meaning).count > 99 ||
        m.reverses.some((rm) => fusion2Texts(rm).count > 99)
    );
  };

  useEffect(() => {
    (() => {
      if (isInvalidTranslation()) setIsCanAction(false);
      else {
        const iniTran = so.translation;
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

  const onAddDefinition = () => {
    if (translation.definitions.length < 22)
      setTranslation({
        ...translation,
        definitions: [...translation.definitions, ""],
      });
  };

  const onChangeDefinition = (e, di) => {
    const value = e.target.value;
    setTranslation({
      ...translation,
      definitions: translation.definitions.map((d, index) =>
        index === di ? value : d
      ),
    });
  };

  const onRemoveDefinition = (di) => {
    setTranslation({
      ...translation,
      definitions: translation.definitions.filter(
        (definition, index) => index !== di
      ),
    });
  };

  const onChangeMeaning = (e, mi) => {
    const value = e.target.value;
    setTranslation({
      ...translation,
      meanings: translation.meanings.map((m, index) =>
        index === mi ? { ...m, meaning: value } : m
      ),
    });
  };

  const onRemoveMeaning = (mi) => {
    if (translation.meanings.length > 1)
      setTranslation({
        ...translation,
        meanings: translation.meanings.filter((meaning, index) => index !== mi),
      });
  };

  const onAddMeaning = () => {
    if (translation.meanings.length < 22)
      setTranslation({
        ...translation,
        meanings: [
          ...translation.meanings,
          {
            meaning: "",
            reverses: [],
          },
        ],
      });
  };

  const onAddReverseMeaning = (mi) => {
    setTranslation({
      ...translation,
      meanings: translation.meanings.map((m, index) =>
        index === mi && m.reverses.length < 22
          ? { ...m, reverses: [...m.reverses, ""] }
          : m
      ),
    });
  };

  const onChangeReverseMeaning = (e, mi, rmi) => {
    const value = e.target.value;
    setTranslation({
      ...translation,
      meanings: translation.meanings.map((m, index) =>
        index === mi
          ? {
              ...m,
              reverses: m.reverses.map((rm, idx) => (idx === rmi ? value : rm)),
            }
          : m
      ),
    });
  };

  const onRemoveReverseMeaning = (mi, rmi) => {
    // && translation.reverses.length > 1
    setTranslation({
      ...translation,
      meanings: translation.meanings.map((m, index) =>
        index === mi
          ? {
              ...m,
              reverses: m.reverses.filter((rm, idx) => idx !== rmi),
            }
          : m
      ),
    });
  };

  const [isUFW, setIsUFW] = useState(false);

  return (
    <Modal isBlackBackDrop={false} onClose={onClose}>
      {isUFW && <UseShortWay onClose={() => setIsUFW(false)}></UseShortWay>}
      <div className="stm">
        <div className="stm-container">
          <div className="stm-header">
            <div className="stm-close stm-closer pointer">
              <BsX size={"32px"} />
            </div>
            <div className="stm-header-title">
              Sentence Translation for <i>{so.sentence}</i>
            </div>
          </div>
          <div className="stm-content">
            <div className="stm-translation mb-3">
              <div className="stm-translation">
                <div className="form-group">
                  <TooltipBasic text={"Image may remind to this sentence"}>
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
                    className="form-control dark-input stm-ipa-input"
                    placeholder="International Phonetic Alphabet"
                    autoComplete="off"
                    id="ipa"
                    name="ipa"
                    maxLength="220"
                    value={translation.ipa}
                    onChange={(e) => onChangeInTran(e)}
                  />
                  <span className="num-length">
                    {220 - translation.ipa.length}
                  </span>
                </div>
                <div className="form-group">
                  <label className="label-cap mb-2">
                    Definitions
                    <BsDash className="ms-1 me-1" />
                    <TooltipBasic text={"Must < 22"}>
                      <span>{translation.definitions.length}</span>
                    </TooltipBasic>
                    <TooltipBasic text={"Add Definition"}>
                      <span onClick={() => onAddDefinition()}>
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
                  {translation.definitions.map((d, di) => (
                    <div className="stm-definition mb-2" key={di}>
                      <textarea
                        type="text"
                        className="form-control dark-input stm-definition-input"
                        placeholder=""
                        autoComplete="off"
                        name="definition"
                        maxLength="2020"
                        value={d}
                        onChange={(e) => onChangeDefinition(e, di)}
                      />
                      <TooltipBasic text={"Remove"}>
                        <span onClick={() => onRemoveDefinition(di)}>
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
                        className={isInvalidTranslation() ? "text-danger" : ""}
                      >
                        Meanings * <BsDash className="ms-1 me-1" />
                        <TooltipBasic text={"Must < 22"}>
                          <span>{translation.meanings.length}</span>
                        </TooltipBasic>
                      </span>
                      <TooltipBasic text={"Add Meaning"}>
                        <span onClick={() => onAddMeaning()}>
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
                  <div className="stm-meanings">
                    {translation.meanings.map((m, mi) => (
                      <div className="stm-meaning-container mb-3" key={mi}>
                        <div className="stm-meaning">
                          <textarea
                            type="text"
                            className="form-control dark-input stm-meaning-input mt-3"
                            placeholder={`Meaning in ${languageSpeaking}`}
                            autoComplete="off"
                            name="meanings"
                            maxLength="2020"
                            value={m.meaning}
                            onChange={(e) => onChangeMeaning(e, mi)}
                          />
                          <TooltipBasic text={"Remove"}>
                            <span onClick={() => onRemoveMeaning(mi)}>
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
                        <div className="stm-convert-meaning">
                          {fusion2Texts(m.meaning).meanings.map((cm, cmi) => (
                            <code key={cmi}>{cm}</code>
                          ))}
                        </div>
                        <div className="hr" />
                        <div className="form-group">
                          <div className="stm-label-with-ques">
                            <label className="label-cap mb-2">
                              Reverse Meaning
                              <BsDash className="ms-1 me-1" />
                              <TooltipBasic text={"Must < 22"}>
                                <span>{m.reverses.length}</span>
                              </TooltipBasic>
                              <TooltipBasic text={"Add Reverse Meaning"}>
                                <span onClick={() => onAddReverseMeaning(mi)}>
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
                          <div className="stm-reverse-meanings">
                            {m.reverses.map((rm, rmi) => (
                              <div
                                className="stm-reverse-meaning-container"
                                key={rmi}
                              >
                                <div className="stm-reverse-meaning">
                                  <textarea
                                    type="text"
                                    className="form-control dark-input stm-reverse-meaning-input"
                                    placeholder={`Reverse meaning in ${languageLearning}`}
                                    autoComplete="off"
                                    name="reverses"
                                    maxLength="2020"
                                    value={rm}
                                    onChange={(e) =>
                                      onChangeReverseMeaning(e, mi, rmi)
                                    }
                                  />
                                  <TooltipBasic text={"Remove"}>
                                    <span
                                      onClick={() =>
                                        onRemoveReverseMeaning(mi, rmi)
                                      }
                                    >
                                      <BsX className="text-danger ms-2 pointer" />
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
                                <div className="stm-convert-reverse-meaning">
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
                    className="form-control dark-input stm-note-input"
                    placeholder=""
                    autoComplete="off"
                    id="note"
                    name="note"
                    maxLength="220"
                    value={translation.note}
                    onChange={(e) => onChangeInTran(e)}
                  />
                  <span className="num-length">
                    {220 - translation.note.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="stm-footer">
          <div className="btn stm-close me-3">Cancel</div>
          <button
            className="btn btn-secondary"
            disabled={!isCanAction}
            onClick={() => onActionAndClose()}
          >
            {isCreate ? "Save Translation" : "Create Translation"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { getLanguagesInMeow })(
  SentenceTranModal
);
