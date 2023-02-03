// import "./WordTranModal.css";
import React, { useEffect, useState } from "react";
import { BsDash, BsX } from "react-icons/bs";
import { fusion2Texts } from "../../../configs/functions";
import { Modal } from "../../Modal";
import { TooltipBasic } from "../../Tooltip";

const TranslationViewModal = ({ onClose, translation, header }) => {
  useEffect(() => {
    var modalCloses = document.querySelectorAll(".wtm-close");
    modalCloses.forEach((modalClose) =>
      modalClose.addEventListener("click", onClose)
    );

    return () => {
      modalCloses.forEach((modalClose) =>
        modalClose.removeEventListener("click", onClose)
      );
    };
  }, [onClose]);

  const [isErrorImg, setIsErrorImg] = useState(false);

  return (
    <Modal isBlackBackDrop={false} onClose={onClose}>
      <div className="wtm">
        <div className="wtm-container">
          <div className="wtm-header">
            <div className="wtm-close wtm-closer pointer">
              <BsX size={"32px"} />
            </div>
            <div className="wtm-header-title">
              Translation of <i>{header}</i>
            </div>
          </div>
          <div className="wtm-content mt-4">
            {!isErrorImg && (
              <img
                className=""
                src={translation.image_url}
                alt=""
                onError={() => setIsErrorImg(true)}
              />
            )}
            <div className="row-center">
              <TooltipBasic text={"International Phonetic Alphabet"}>
                <label className="label-cap mb-2" htmlFor="ipa">
                  IPA
                </label>
              </TooltipBasic>
              <span className="ms-3">{translation.ipa}</span>
            </div>
            <div className="hr" />
            <div className="form-group">
              <label className="label-cap mb-2">Trans</label>
            </div>
            <div className="wtm-trans mb-3">
              {translation.trans.map((tans, index) => (
                <div className="wtm-translation" key={index}>
                  <label
                    className="label-cap mb-2 mb-3 text-success"
                    htmlFor="pos"
                  >
                    Trans with POS is {tans.pos}
                  </label>
                  <div className="form-group">
                    <label className="label-cap mb-2">
                      Definitions
                      <BsDash className="ms-1 me-1" />
                      <TooltipBasic text={"Must < 22"}>
                        <span>{tans.definitions.length}</span>
                      </TooltipBasic>
                    </label>
                    {tans.definitions.map((d, di) => (
                      <div className="ms-2 mb-1" key={di}>
                        <BsDash className="ms-1 me-1" />
                        {d}
                      </div>
                    ))}
                  </div>
                  <div className="form-group">
                    <div>
                      <label className="label-cap mb-2">
                        <span>
                          Meanings * <BsDash className="ms-1 me-1" />
                          <TooltipBasic text={"Must < 22"}>
                            <span>{tans.meanings.length}</span>
                          </TooltipBasic>
                        </span>
                      </label>
                    </div>
                    <div className="wtm-meanings">
                      {tans.meanings.map((m, mi) => (
                        <div className="wtm-meaning-container mb-3" key={mi}>
                          <span>
                            <BsDash className="ms-1 me-1" />
                            {m.meaning}
                          </span>
                          <small
                            className={`label-flexcap mt-2 mb-3 ${
                              fusion2Texts(m.meaning).length < 99
                                ? "text-success"
                                : "text-danger"
                            }`}
                          >
                            Meanings can be
                            <BsDash className="ms-1 me-1" />
                            <TooltipBasic text={"Must < 99"}>
                              <span>
                                {m.meaning.length > 0
                                  ? fusion2Texts(m.meaning).length
                                  : 0}
                              </span>
                            </TooltipBasic>
                          </small>
                          <div className="wtm-convert-meaning">
                            {fusion2Texts(m.meaning).map((cm, cmi) => (
                              <code key={cmi}>{cm}</code>
                            ))}
                          </div>
                          <div className="hr" />
                          <div className="form-group">
                            <div className="wtm-label-with-ques">
                              <label className="label-cap mb-2">
                                Reverse Meaning
                                <BsDash className="ms-1 me-1" />
                                <TooltipBasic text={"Must < 22"}>
                                  <span>{m.reverses.length}</span>
                                </TooltipBasic>
                              </label>
                            </div>
                            <div className="wtm-reverse-meanings">
                              {m.reverses.map((rm, rmi) => (
                                <div
                                  className="wtm-reverse-meaning-container"
                                  key={rmi}
                                >
                                  <span>
                                    <BsDash className="ms-1 me-1" />
                                    {rm}
                                  </span>
                                  <small
                                    className={`label-flexcap mt-2 mb-3 ${
                                      fusion2Texts(rm).length < 99
                                        ? "text-success"
                                        : "text-danger"
                                    }`}
                                  >
                                    Reverse meanings can be
                                    <BsDash className="ms-1 me-1" />
                                    <TooltipBasic text={"Must < 99"}>
                                      <span>
                                        {rm.length > 0
                                          ? fusion2Texts(rm).length
                                          : 0}
                                      </span>
                                    </TooltipBasic>
                                  </small>
                                  <div className="wtm-convert-reverse-meaning">
                                    {fusion2Texts(rm).map((crm, crmi) => (
                                      <code key={crmi}>{crm}</code>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="row-center mb-4">
                    <label className="label-cap mb-2" htmlFor="note">
                      Note
                    </label>
                    <span className="ms-3">{tans.note}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TranslationViewModal;
