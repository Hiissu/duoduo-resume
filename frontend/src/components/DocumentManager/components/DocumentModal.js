/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { lexicalVersion } from "../../../configs/constants";
import { Editor as LexicalEditor } from "../../LexicalEditor";
import { Modal } from "../../Modal";
import "./DocumentModal.css";

const DocumentModal = ({
  onClose,
  doo,
  di,
  onSaveDocument,
  docsInCollection,
}) => {
  const [isChanged, setIsChanged] = useState(false);
  const [isShake, setIsShake] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsShake(false);
    }, 1234);

    return () => {
      clearTimeout(timer);
    };
  }, [isChanged, isShake]);

  const onFinishEdit = useCallback(() => {
    if (isChanged) setIsShake(true);
    else onClose();
  }, [isChanged, onClose]);

  const [docInitial] = useState(doo);
  const [docName, setDocName] = useState(doo.name);
  const [docContent, setDocContent] = useState(doo.content);
  const [docVersion] = useState(doo.version);

  const onChangeDocName = (e) => {
    const value = e.target.value;
    setDocName(value);
  };

  const onChangeDocContent = (content) => {
    setDocContent(content);
  };

  const maxMegabytes = 8;
  const maxBytes = 8388608;
  const [docsInCollectionSize] = useState(
    maxBytes - new Blob([JSON.stringify(docsInCollection)]).size
  );

  const [bytesLeft, setBytesLeft] = useState(8388608);

  useEffect(() => {
    (() => {
      const documentDetail = {
        name: docName,
        content: docContent,
        version: docVersion,
      };

      const documentDetailStringify = JSON.stringify(documentDetail);
      const documentDetailSize = new Blob([documentDetailStringify]).size;
      const bytesRemain = docsInCollectionSize - documentDetailSize;
      setBytesLeft(bytesRemain);

      if (
        docName.length > 0 &&
        docContent.length > 0 &&
        bytesRemain > 0 &&
        documentDetailStringify !== JSON.stringify(docInitial)
      )
        setIsChanged(true);
      else setIsChanged(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docName, docContent]);

  const [tooggleReset, setTooggleReset] = useState(false);
  const onReset = () => {
    setDocName(docInitial.name);
    setDocContent(docInitial.content);
    setTooggleReset(!tooggleReset);
  };

  const onNoteChanges = () => {
    const documentDetail = {
      name: docName,
      content: docContent,
      version: lexicalVersion,
    };
    onSaveDocument(documentDetail, di);
    onClose();
  };

  return (
    <Modal isBlackBackDrop={true} onClose={onClose}>
      <div className="dm">
        <div className="dm-editor">
          <div className="moodal-header">
            <div className="moodal-closer" onClick={() => onFinishEdit()}>
              <span>
                <FaArrowLeft size={"32px"} className="me-2" />
              </span>
              <span className="label-cap mb-2">Back</span>
            </div>
            {/* <div className="moodal-title"></div> */}
          </div>
          <div className="form-group">
            <label
              htmlFor="dm-doc-name"
              className={`label-cap mb-2 ${
                docName.length > 0 ? "" : "text-danger"
              }`}
            >
              Document Name *
            </label>
            <input
              type="text"
              className="form-control dark-input"
              id="dm-doc-name"
              autoComplete="nope"
              name="name"
              value={docName}
              onChange={onChangeDocName}
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="dm-doc-content" className="label-cap mb-2">
              Document Content *
            </label>
            <LexicalEditor
              isReadOnly={false}
              content={docContent}
              tooggleReset={tooggleReset}
              onChangeContent={onChangeDocContent}
            />
          </div>
          <span className={`num-length ${bytesLeft > 0 ? "" : "text-danger"}`}>
            <span className="me-3">Bytes left:</span>
            {bytesLeft}
          </span>
        </div>
      </div>
      <div
        className={`form-row dm-footer 
          ${isChanged ? "eases-in" : "eases-out"} 
          ${isShake ? "shake" : ""}
        `}
      >
        <div className="col btn" onClick={() => onReset()}>
          Reset
        </div>
        <button
          className="col btn btn-secondary"
          disabled={!isChanged}
          onClick={() => onNoteChanges()}
        >
          Note Changes
        </button>
      </div>
    </Modal>
  );
};

export default DocumentModal;
