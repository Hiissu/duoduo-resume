import { IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { BsDash, BsPencil, BsPlus, BsX, BsXCircle } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { lexicalVersion } from "../../configs/constants";
import { RemoveDeleteModal } from "../Modal";
import { DarkTooltip } from "../Tooltip";
import { DocumentModal } from "./components";
import "./DocumentManager.css";

// const DocumentManager = ({ collectionId, forClose, setForClose, onClose }) => {
const DocumentManager = ({ onClose }) => {
  const dispatch = useDispatch();
  const { collections } = useSelector((state) => state.collection);

  const [docsInitial, setDocsInitial] = useState([]);
  const [docsInCollection, setDocsInCollection] = useState([]);
  const [isCreator, setIsCreator] = useState(false);

  // useEffect(() => {
  //   (async () => {
  //     const collectionLoaded = collections.find((l) => l.id === collectionId);
  //     setIsCreator(collectionLoaded.is_creator || false);

  //     const documents = collectionLoaded.documents;
  //     let documentsParse;
  //     try {
  //       documentsParse = JSON.parse(documents);
  //       if (!documentsParse) documentsParse = [];
  //     } catch (error) {
  //       documentsParse = [];
  //     }
  //     setDocsInitial(documentsParse);
  //     setDocsInCollection(documentsParse);
  //   })();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [collections]);

  const [isCanSave, setIsCanSave] = useState(false);
  // useEffect(() => {
  //   (() => {
  //     if (
  //       docsInCollection.some(
  //         (doc) => doc.name.trim().length < 1 || doc.content.length < 1
  //       )
  //     ) {
  //       setIsCanSave(false);
  //       setForClose({ ...forClose, isCanClose: true });
  //     } else {
  //       if (JSON.stringify(docsInitial) !== JSON.stringify(docsInCollection)) {
  //         setIsCanSave(true);
  //         setForClose({ ...forClose, isCanClose: false });
  //       } else {
  //         setIsCanSave(false);
  //         setForClose({ ...forClose, isCanClose: true });
  //       }
  //     }
  //   })();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [docsInCollection]);

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     if (forClose.isCanClose === false && forClose.isShake === true)
  //       setForClose({ ...forClose, isShake: false });
  //   }, 1234);

  //   return () => {
  //     clearTimeout(timer);
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [forClose]);

  const onReset = () => {
    setDocsInCollection(docsInitial);
    // setForClose({ ...forClose, isShake: false });
  };

  const onSave = () => {
    const docsInCollectionStringify = JSON.stringify(docsInCollection);

    const sizeDocs = new Blob([docsInCollectionStringify]).size;
    console.log(
      "\n On save",
      docsInCollectionStringify,
      sizeDocs,
      8388608 - sizeDocs
    );

    // do save
  };

  const defaultContent = `{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}`;

  const [defaultDoc] = useState({
    name: "New Document",
    content: defaultContent,
    version: lexicalVersion,
  });

  const onAddDocument = () => {
    if (docsInCollection.length < 20) {
      const newDocs = [...docsInCollection, defaultDoc];
      setDocsInCollection(newDocs);
    }
  };

  const [isRemoveDoc, setIsRemoveDoc] = useState({ is: false, doo: {}, di: 0 });
  const [isEditDoc, setIsEditDoc] = useState({
    is: false,
    doo: {},
    di: 0,
  });

  const onRemoveDocument = (object) => {
    const newDocs = docsInCollection.filter(
      (doc, index) => index !== object.di
    );
    setDocsInCollection(newDocs);
  };

  const onSaveDocument = (newDoc, di) => {
    const newDocs = docsInCollection.map((doc, index) =>
      index === di ? newDoc : doc
    );
    setDocsInCollection(newDocs);
  };

  return (
    <>
      {isEditDoc.is && (
        <DocumentModal
          onClose={() => setIsEditDoc({ ...isEditDoc, is: false })}
          doo={isEditDoc.doo}
          di={isEditDoc.di}
          onSaveDocument={onSaveDocument}
          docsInCollection={docsInCollection}
        />
      )}

      {isRemoveDoc.is && (
        <RemoveDeleteModal
          onClose={() => setIsRemoveDoc({ ...isRemoveDoc, is: false })}
          object={isRemoveDoc}
          action={"remove"}
          subject={"document"}
          bridge={""}
          target={isRemoveDoc.doo.name}
          onAction={onRemoveDocument}
        />
      )}

      <div className="dmr">
        <div className="moodal-header">
          <div className="moodal-closer">
            <BsXCircle size={"32px"} onClick={() => onClose()} />
            <div className="moodal-esc">ESC</div>
          </div>
          <div className="moodal-title">Document Manager</div>
        </div>
        <div className="form-group">
          <DarkTooltip title="Documents Num cannot > 20" placement="top" arrow>
            <label className="label-cap mb-2">
              <span>Documents</span>
              <BsDash className="ms-1 me-1" size={"20px"} />
              <span className="me-2">{docsInCollection.length}</span>
            </label>
          </DarkTooltip>
          <DarkTooltip title="Add Document" placement="top" arrow>
            <IconButton onClick={() => onAddDocument()}>
              <BsPlus className="pointer" size={"26px"} />
            </IconButton>
          </DarkTooltip>
        </div>
        <div className="dmr-docs ms-4 me-4">
          {docsInCollection.length > 0 ? (
            docsInCollection.map((doc, index) => (
              <div className="dmr-doc" key={index}>
                {doc.name}
                <small className="ms-2 me-2 text-success">
                  {JSON.stringify(doc) !== JSON.stringify(defaultDoc) ? (
                    JSON.stringify(doc) !==
                      JSON.stringify(docsInitial[index]) && (
                      <span>Has Changed</span>
                    )
                  ) : (
                    <span>Recently Added</span>
                  )}
                </small>
                {/* {isCreator && ( */}
                {true && (
                  <>
                    <DarkTooltip title="Edit" placement="top" arrow>
                      <IconButton
                        onClick={() =>
                          setIsEditDoc({ is: true, doo: doc, di: index })
                        }
                      >
                        <BsPencil className="ms-2 me-2" size={"22px"} />
                      </IconButton>
                    </DarkTooltip>
                    <DarkTooltip title="Remove" placement="top" arrow>
                      <IconButton
                        onClick={() =>
                          setIsRemoveDoc({ is: true, doo: doc, di: index })
                        }
                      >
                        <BsX
                          className="text-danger ms-2 me-2 pointer"
                          size={"22px"}
                        />
                      </IconButton>
                    </DarkTooltip>
                  </>
                )}
              </div>
            ))
          ) : (
            <div className="dmr-docs-none">No docs available</div>
          )}
        </div>
      </div>
      {/*  ${forClose.isShake ? "shake" : ""} */}
      <div
        className={`form-row dmr-footer 
           ${isCanSave ? "eases-in" : "eases-out"}
          
        `}
      >
        <div className="col btn" onClick={() => onReset()}>
          Reset
        </div>
        <button
          className="col btn btn-success"
          disabled={!isCanSave}
          onClick={() => onSave()}
        >
          Save Changes
        </button>
      </div>
    </>
  );
};

export default DocumentManager;
