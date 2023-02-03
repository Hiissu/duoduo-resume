import "./WordSearchTransModal.css";
import React, { useEffect, useState } from "react";
import {
  BsDash,
  BsEyeFill,
  BsSearch,
  BsStar,
  BsStarFill,
  BsX,
} from "react-icons/bs";
import { connect } from "react-redux";
import { createSearchParams } from "react-router-dom";
import {
  loadWordTranslations,
  removeWordTranslation,
  uweWordTranslation,
} from "../../store/actions/word";
import { Modal } from "../Modal";
import { WordTranModal } from ".";
import { SearchError } from "../Error";
import { PopupBottomLeft } from "../Popup";
import { TooltipBasic } from "../Tooltip";

import { Paginator } from "../Paginator";

const WordSearchTransModal = ({
  object,
  onClose,
  wordTransUsing,
  loadWordTranslations,
  uweWordTranslation,
  removeWordTranslation,
}) => {
  useEffect(() => {
    var modalCloses = document.querySelectorAll(".wstm-close");
    modalCloses.forEach((modalClose) =>
      modalClose.addEventListener("click", onClose)
    );

    return () => {
      modalCloses.forEach((modalClose) =>
        modalClose.removeEventListener("click", onClose)
      );
    };
  }, [onClose]);

  const [isuccess, setIsuccess] = useState(true);
  const [translations, setTranslations] = useState([]);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [numTranslations, setNumTranslations] = useState(0);

  const [isVerified, setIsVerified] = useState(true);
  const [query, setQuery] = useState("");

  const set2Success = (response) => {
    setTranslations(response.translations);
    setNumPages(response.num_pages);
    setCurrentPage(response.current_page);
    setNumTranslations(response.num_translations);
  };

  const [lastParams, setLastParams] = useState({
    query: "",
    isverified: true,
    page: 1,
  });

  const onSearch = () => {
    const newParams2Search = {
      query: query,
      isverified: isVerified,
      page: 1,
    };
    if (JSON.stringify(lastParams) !== JSON.stringify(newParams2Search)) {
      setLastParams(newParams2Search);

      (async () => {
        const params = `?${createSearchParams(newParams2Search)}`;
        const response = await loadWordTranslations(object.id, params);
        if (response.isuccess) set2Success(response);
        setIsuccess(response.isuccess);
      })();
    }
  };

  useEffect(
    () =>
      (async () => {
        const params = `?${createSearchParams(lastParams)}`;
        const response = await loadWordTranslations(object.id, params);
        if (response.isuccess) set2Success(response);
        setIsuccess(response.isuccess);
      })(),
    [lastParams, loadWordTranslations, object.id]
  );

  const onChangePage = async (page) => {
    const params2Search = {
      query: query,
      isverified: isVerified,
      page: page,
    };
    const params = `?${createSearchParams(params2Search)}`;
    const response = await loadWordTranslations(object.id, params);
    if (response.isuccess) set2Success(response);
    setIsuccess(response.isuccess);
  };

  const onChangeQuery = (e) => {
    const value = e.target.value.toLowerCase();
    setQuery(value);
  };

  const searchOnEnter = (e) => {
    if (e.key === "Enter") onSearch();
  };

  const [isViewWordTran, setIsViewWordTran] = useState({
    is: false,
    object: {},
  });

  const [isPopUp, setIsPopUp] = useState(false);
  const [popUp, setPopUp] = useState({
    type: "",
    message: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPopUp(false);
    }, 3456);

    return () => {
      clearTimeout(timer);
    };
  }, [isPopUp]);

  // ~> for use word translation
  const onUseTran = async (wordId, translation) => {
    const response = await uweWordTranslation(wordId, translation);
    setIsPopUp(true);

    setPopUp({
      type: response.isuccess ? "text-success" : "text-danger",
      message: response.message,
    });

    // onShowSnackPack(response.message);
  };

  // ~> for remove word translation
  const onRemoveTran = async (wordId, translationId) => {
    const response = await removeWordTranslation(wordId, translationId);
    setIsPopUp(true);
    setPopUp({
      type: response.isuccess ? "text-success" : "text-danger",
      message: response.message,
    });

    // onShowSnackPack(response.message);
  };

  return (
    <>
      {isViewWordTran.is && (
        <WordTranModal
          onClose={() => setIsViewWordTran({ ...isViewWordTran, is: false })}
          object={isViewWordTran.object}
          isReadOnly={true}
          isCreate={false}
          onAction={() => {}}
        />
      )}

      <Modal isBlackBackDrop={false} onClose={onClose}>
        <div className="wstm">
          <PopupBottomLeft isShow={isPopUp}>
            <span className={popUp.type}>{popUp.message}</span>
          </PopupBottomLeft>
          <div className="wstm-container">
            <div className="wstm-header">
              <div className="wstm-close wstm-closer pointer">
                <BsX size={"32px"} />
              </div>
              <div className="wstm-header-title">
                Find translation for <i>{object.word}</i>
              </div>
            </div>
            <div className="wstm-content mt-4 mb-4">
              <div className="form-group">
                <label className="label-cap mb-2" htmlFor="creator-name">
                  Creator's name
                </label>
                <div className="wstm-search">
                  <input
                    type="text"
                    className="form-control dark-input"
                    autoComplete="off"
                    id="creator-name"
                    autoFocus
                    value={query}
                    onChange={(e) => onChangeQuery(e)}
                    onKeyDown={(e) => searchOnEnter(e)}
                  />
                  <div onClick={() => onSearch()}>
                    <div className="input-group-text btn">
                      <small>"Enter" to Search</small>
                    </div>
                    <button className="input-group-append btn btn-outline-secondary">
                      <BsSearch size={"24px"} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="is-verify"
                  defaultChecked={isVerified}
                  onChange={() => setIsVerified(!isVerified)}
                />
                <label
                  className="label-cap mb-2 form-check-label"
                  htmlFor="is-verify"
                >
                  Verified
                </label>
              </div>
              <label className="label-cap mb-2 ms-2 mt-2">
                Translation
                <BsDash className="ms-1 me-1" />
                {numTranslations}
              </label>
              {isuccess ? (
                translations.length > 0 ? (
                  <>
                    <div className="wstm-result">
                      <div className="wstm-result-header wstm-translation">
                        <div className="wstm-creator label-cap mb-2">
                          Creator
                        </div>
                        <div className="wstm-num-users label-cap mb-2">
                          Number of Users
                        </div>
                        <div className="wstm-use label-cap mb-2">Use</div>
                      </div>
                      <div className="wstm-result-body">
                        {translations.map((tran) => (
                          <div key={tran.id} className="wstm-translation mb-1">
                            <div className="wstm-creator">
                              <TooltipBasic text={"View Translation"}>
                                <div
                                  className="pointer"
                                  onClick={() =>
                                    setIsViewWordTran({
                                      is: true,
                                      object: tran.translation,
                                    })
                                  }
                                >
                                  Creator
                                  <span className="ms-2 me-2">
                                    {tran.creator_username}
                                  </span>
                                  <button className="btn btn-outline-secondary btn-circle-sm">
                                    <BsEyeFill />
                                  </button>
                                </div>
                              </TooltipBasic>
                            </div>
                            <div className="wstm-num-users">
                              {tran.num_users}
                            </div>
                            <div className="wstm-use">
                              {wordTransUsing.some(
                                (tan) => tan.id === tran.id
                              ) ? (
                                <TooltipBasic
                                  text={"Remove from Using Translations"}
                                >
                                  <button
                                    className="btn btn-outline-secondary btn-circle-sm"
                                    onClick={() =>
                                      onRemoveTran(tran.word_id, tran.id)
                                    }
                                  >
                                    <BsStarFill />
                                  </button>
                                </TooltipBasic>
                              ) : (
                                <TooltipBasic
                                  text={"Add to Using Translations"}
                                >
                                  <button
                                    className="btn btn-outline-secondary btn-circle-sm"
                                    onClick={() =>
                                      onUseTran(tran.word_id, tran)
                                    }
                                  >
                                    <BsStar />
                                  </button>
                                </TooltipBasic>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Paginator
                      numPages={numPages}
                      currentPage={currentPage}
                      onChangePage={onChangePage}
                    />
                  </>
                ) : (
                  <div className="text-center">No translations available</div>
                )
              ) : (
                <SearchError />
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, {
  loadWordTranslations,
  uweWordTranslation,
  removeWordTranslation,
})(WordSearchTransModal);
