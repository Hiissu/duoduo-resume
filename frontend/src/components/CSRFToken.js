import React from "react";

const CSRFToken = ({}) => {
  // const [csrftoken, setcsrftoken] = useState("");
  //    setcsrftoken(getCookie("csrftoken"));

  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      let cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  return (
    <input
      type="hidden"
      name="csrfmiddlewaretoken"
      value={getCookie("csrftoken")}
    />
  );
};

export default CSRFToken;
