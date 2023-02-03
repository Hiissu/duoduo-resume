import { useState, useEffect } from "react";

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    // only execute all the code below in client side
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);

      // Call handler right away so state gets updated with initial window size
      handleResize();

      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  return windowSize;
}

export default useWindowSize;

// const windowSize = useWindowSize();
// {windowSize.width > 690 && <YourComponent />}
