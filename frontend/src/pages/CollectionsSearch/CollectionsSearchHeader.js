import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createSearchParams, useNavigate } from "react-router-dom";
import { Categories } from "../../components/Category";
import { CollectionSearchBar } from "../../components/Collection";
import { COLLECTIONS_SEARCH_URL } from "../../configs/navigators";

const CollectionsSearchHeader = ({
  params2Search,
  lastParams,
  setLastParams,
}) => {
  const { categories } = useSelector((state) => state.category);

  const getTopicsFromParams = useCallback(
    (categories) => {
      let topicsValid = [];
      categories.forEach((category) =>
        category.topics.forEach((topic) => {
          if (params2Search.topicid.includes(topic.id.toString()))
            topicsValid.push(topic);
        })
      );
      return topicsValid;
    },
    [params2Search]
  );

  const [options] = useState([
    {
      id: "0",
      title: "Collection",
      description: "Search for collection's name",
    },
    { id: "1", title: "Creator", description: "Search for creator's name" },
  ]);
  const getOptionFromParams = () => {
    const found = options.find((op) => op.id === params2Search.option);
    if (found) return found;
    else return options[0];
  };

  const [query, setQuery] = useState(params2Search.query || "");
  const [option, setOption] = useState(() => getOptionFromParams());

  const [topicsSelected, setTopicsSelected] = useState([]);
  useEffect(() => {
    const topicsValid = getTopicsFromParams(categories);
    setTopicsSelected(topicsValid);
  }, [categories, getTopicsFromParams]);

  const navigate = useNavigate();
  const navigate2Search = (newParams2Search) => {
    navigate({
      pathname: COLLECTIONS_SEARCH_URL,
      search: `?${createSearchParams(newParams2Search)}`,
    });
  };

  const onSearch = () => {
    if (query.length > 0 || topicsSelected.length > 0) {
      const newParams2Search = {
        query: query,
        option: option.id,
        topicid: topicsSelected.map((topic) => topic.id),
        page: 1,
      };
      if (JSON.stringify(lastParams) !== JSON.stringify(newParams2Search)) {
        setLastParams(newParams2Search);
        navigate2Search(newParams2Search);
      }
    }
  };

  const onChangeTopics = (isadd, topico) => {
    if (isadd) setTopicsSelected([...topicsSelected, topico]);
    else {
      const newTopicsSelected = topicsSelected.filter(
        (topic) => topic.id !== topico.id
      );
      setTopicsSelected(newTopicsSelected);
    }
  };

  return (
    <>
      <CollectionSearchBar
        query={query}
        setQuery={setQuery}
        option={option}
        options={options}
        setOption={setOption}
        onSearch={onSearch}
      />
      <Categories
        topicsSelected={topicsSelected}
        onChangeTopics={onChangeTopics}
      />
    </>
  );
};

export default CollectionsSearchHeader;
