import { AUTHENTICATED_FAIL, AUTHENTICATED_SUCCESS } from "./types";
import { clearMeowStore } from "./user";

export const checkAuthenticated = (response) => async (dispatch) => {
  const status = response.status;

  if (status === 200) {
    dispatch({ type: AUTHENTICATED_SUCCESS });
  } else if (status === 401 || status === 403) {
    dispatch({ type: AUTHENTICATED_FAIL });
    dispatch(clearMeowStore());
  }
};
