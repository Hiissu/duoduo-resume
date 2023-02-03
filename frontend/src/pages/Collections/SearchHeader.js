import React, { useState } from "react";
import { createSearchParams, useNavigate } from "react-router-dom";
import { Categories } from "../../components/Category";
import { CollectionSearchBar } from "../../components/Collection";
import { COLLECTIONS_SEARCH_URL } from "../../configs/navigators";

const SearchHeader = () => {
  const [query, setQuery] = useState("");

  const optionsArr = () => {
    return [
      {
        id: "0",
        title: "Collection",
        description: "Search for collection's name",
      },
      { id: "1", title: "Creator", description: "Search for creator's name" },
    ];
  };

  const [option, setOption] = useState(() => optionsArr()[0]);
  const [options] = useState(() => optionsArr());

  const [topicsSelected, setTopicsSelected] = useState([]);

  const navigate = useNavigate();
  const navigate2Search = () => {
    const params2Search = {
      query: query,
      option: option.id,
      topicid: topicsSelected.map((topic) => topic.id),
      page: 1,
    };
    navigate({
      pathname: COLLECTIONS_SEARCH_URL,
      search: `?${createSearchParams(params2Search)}`,
    });
  };

  const onSearch = () => {
    if (query.length > 0 || topicsSelected.length > 0) navigate2Search();
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

export default SearchHeader;
