import axios from "axios";

// get authozation key
export const getKey = () => async (dispatch) => {
  const url = `https://edge.microsoft.com/translate/auth`;
  try {
    const response = await axios.get(url);
    return { isuccess: true, key: response.data };
  } catch (error) {
    return { isuccess: false };
  }
};

export const microsoftTranslate =
  (arrayNeedTran) => async (dispatch, getState) => {
    const response = await dispatch(getKey());
    if (response.isuccess) {
      const config = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${response.key}`,
        },
      };

      const bodyTexts = [];
      arrayNeedTran.forEach((element) =>
        bodyTexts.push({ Text: element.content })
      );

      const convert2Texts = arrayNeedTran.map((element) => ({
        Text: element.content,
      }));

      const body = JSON.stringify(bodyTexts);

      const user = getState().user;
      const languageLearning = user.languageLearning.language_code;
      const languageSpeaking = user.languageSpeaking.language_code;

      const url = `https://api.cognitive.microsofttranslator.com/translate?from=${languageLearning}&to=${languageSpeaking}&api-version=3.0`;

      try {
        const response = await axios.post(url, body, config);
        const responseData = response.data;
        return { isuccess: true, translate: responseData };
      } catch (error) {
        console.log(error);
        return { isuccess: false, message: error };
      }
    }
  };
