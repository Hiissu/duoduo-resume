import React, { useEffect, useCallback } from "react";
import "./DocumentViewModal.css";
import { BsXCircle } from "react-icons/bs";
import { Editor as LexicalEditor } from "../../LexicalEditor";

const DocumentViewModal = ({ onClose, object }) => {
  const closeOnEscape = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.body.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.removeEventListener("keydown", closeOnEscape);
    };
  }, [closeOnEscape]);

  return (
    <>
      <div className={"dvm-backdrop"} onClick={() => onClose()}></div>
      <div className="dvm">
        <div className="moodal-closer" onClick={() => onClose()}>
          <BsXCircle size={"32px"} />
          <div className="moodal-esc">ESC</div>
        </div>
        <div className="dm-editor">
          <div className="form-group dvm-name-wrapper">
            <label htmlFor="dm-doc-name" className="label-cap me-3">
              Document Name
            </label>
            <span className="">{object.name}</span>
          </div>
          <div className="form-group mt-2">
            <label htmlFor="dm-doc-content" className="label-cap mb-2">
              Document Content
            </label>
            <LexicalEditor
              // isReadOnly={true}
              isReadOnly={false}
              documentContent={object.content}
              tooggleReset={true}
              onChangeDocumentContent={() => {}}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentViewModal;
