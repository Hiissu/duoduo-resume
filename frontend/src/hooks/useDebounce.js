/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";

const useDebounce = (value, delay) => {
  // https://usehooks-ts.com/react-hook/use-debounce
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;

const useDebounceUsage = () => {
  const [searchValue, setSearchValue] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const debouncedValue = useDebounce(searchValue, 500);

  useEffect(() => {
    if (!debouncedValue.trim()) {
      setSearchResult([]);
      return;
    }

    const fetchApi = async () => {
      setLoading(true);
      // eslint-disable-next-line no-undef
      const result = await searchHandle.search(debouncedValue);
      setSearchResult(result);
      setLoading(false);
    };
    fetchApi();
  }, [debouncedValue]);
  return <></>;
};
