import "./Categories.css";
import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  BsPlusCircle,
  BsX,
  BsSearch,
  BsDash,
  BsChevronDown,
} from "react-icons/bs";
import { DarkTooltip } from "../Tooltip";
import { IconButton } from "@mui/material";

const Categories = ({ topicsSelected, onChangeTopics }) => {
  const { categories } = useSelector((state) => state.category);

  const queryRef = useRef();
  const [query, setQuery] = useState("");
  const [categoriesLeft, setCategoriesLeft] = useState([]);

  useEffect(() => {
    const categoriesAvailable = categories?.map((category) => ({
      ...category,
      topics: category.topics.filter(
        (topic) => !topicsSelected.some((ele) => ele.id === topic.id)
      ),
    }));
    setCategoriesLeft(categoriesAvailable);

    queryRef.current.focus();
    // && topic.name.toLowerCase().indexOf(query) > -1
  }, [categories, topicsSelected]);

  const [isShowTopics, setIsShowTopics] = useState(false);
  const onDisplayTopics = () => {
    setIsShowTopics(!isShowTopics);
    // setQuery("");
    queryRef.current.focus();
  };

  const onSearchTopics = (e) => {
    const query = e.target.value.toLowerCase();
    setQuery(query);
  };

  // const tranform = useSpring({
  //   duration: 100,
  //   transform: `rotate(${isShowTopics ? 0 : 180}deg)`,
  // });

  const CategoryTopics = ({ topics, isRemove, onChange }) => {
    const isMatchQuery = (element) => {
      return isRemove ? true : element.name.toLowerCase().indexOf(query) > -1;
    };

    return (
      <div className="category-topics">
        {topics.map(
          (element) =>
            isMatchQuery(element) && (
              <div
                className="category-topic"
                key={element.id}
                onClick={() => onChange(!isRemove, element)}
              >
                <div className="category-topic-name">{element.name}</div>
                {isRemove && (
                  <button className="category-topic-remove">
                    <BsX />
                  </button>
                )}
              </div>
            )
        )}
      </div>
    );
  };

  return (
    <>
      <label
        htmlFor="topic-input"
        className="label-cap mb-2 d-flex pointer"
        onClick={() => onDisplayTopics()}
      >
        Topic
        <BsDash className="ms-2 me-2" />
        {topicsSelected.length < 21 ? (
          <span>{topicsSelected.length}</span>
        ) : (
          <DarkTooltip title={"Cannot > 20"} placement={"top"}>
            <span className="text-danger">{topicsSelected.length}</span>
          </DarkTooltip>
        )}
        {isShowTopics ? (
          <span>
            <DarkTooltip title={"Hide Topics"} placement={"top"}>
              <IconButton>
                <BsChevronDown size={"18px"} className="ms-2" />
              </IconButton>
            </DarkTooltip>
          </span>
        ) : (
          <DarkTooltip title={"Show Topics"} placement={"top"}>
            <IconButton>
              <BsPlusCircle size={"18px"} className="ms-2" />
            </IconButton>
          </DarkTooltip>
        )}
      </label>

      <CategoryTopics
        isRemove={true}
        topics={topicsSelected}
        onChange={onChangeTopics}
      />

      <div className={isShowTopics ? "d-block" : "d-none"}>
        <div className="input-group mb-3">
          <input
            type="search"
            className="form-control dark-input"
            id="topic-input"
            maxLength="200"
            placeholder="Search topics"
            autoComplete="off"
            value={query}
            ref={queryRef}
            onChange={(e) => onSearchTopics(e)}
          />
          <button className="input-group-append btn btn-outline-secondary">
            <BsSearch size={"24px"} />
          </button>
        </div>
        <div className="category-wrapper">
          {categoriesLeft.some((category) => category.topics.length > 0) ? (
            categoriesLeft.map(
              (category) =>
                category.topics.length > 0 && (
                  <div key={category.id} className="category">
                    <div>
                      <small className="label-cap mb-2 me-3">Category</small>
                      <span>{category.name}</span>
                    </div>
                    <div className="category-topics-wrapper">
                      <CategoryTopics
                        isRemove={false}
                        topics={category.topics}
                        onChange={onChangeTopics}
                      />
                    </div>
                    <hr />
                  </div>
                )
            )
          ) : (
            <div className="d-flex justify-content-center">Nope!</div>
          )}
        </div>
      </div>
    </>
  );
};

export default Categories;
