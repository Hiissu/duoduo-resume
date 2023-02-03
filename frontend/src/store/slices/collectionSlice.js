import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";
import { resetAuth } from "./authSlice";

import {
  COLLECTIONS_CREATE_URL,
  COLLECTIONS_DELETE_URL,
  COLLECTIONS_DETAIL_URL,
  COLLECTIONS_LEARNING_URL,
  COLLECTIONS_LEARN_URL,
  COLLECTIONS_REMOVE_URL,
  // COLLECTIONS_REVIEW_URL,
  COLLECTIONS_SEARCH_URL,
  COLLECTIONS_URL,
} from "../../configs/endpoints";
import {
  timeMs2DateTime,
  topicIds2Topics,
  validateDocuments,
} from "../../configs/functions";

export const getCollectionsLearning = createAsyncThunk(
  "collection/getCollectionsLearning",
  async (_, thunkAPI) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      withCredentials: true,
    };
    try {
      const response = await axios.get(COLLECTIONS_LEARNING_URL, config);
      return response.data;
    } catch (error) {
      if (error.response) thunkAPI.dispatch(resetAuth(error.response.status));
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getCollections = createAsyncThunk(
  "collection/getCollections",
  async ({ params }, thunkAPI) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      withCredentials: true,
    };
    try {
      const response = await axios.get(COLLECTIONS_URL(params), config);
      return response.data;
    } catch (error) {
      if (error.response) thunkAPI.dispatch(resetAuth(error.response.status));
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const searchCollections = createAsyncThunk(
  "collection/searchCollections",
  async ({ params }, thunkAPI) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      withCredentials: true,
    };
    try {
      const response = await axios.get(COLLECTIONS_SEARCH_URL(params), config);
      return response.data;
    } catch (error) {
      if (error.response) thunkAPI.dispatch(resetAuth(error.response.status));
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const reshapeCollectionDetail =
  (collection) => async (dispatch, getState) => {
    const { categories } = getState().category;

    const payload = {
      ...collection,
      topics: topicIds2Topics(collection.topics, categories),
      documents: validateDocuments(collection.documents),
    };

    return payload;
  };

export const getCollectionDetail = createAsyncThunk(
  "collection/getCollectionDetail",
  async ({ collectionId }, thunkAPI) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      withCredentials: true,
    };
    try {
      const response = await axios.get(
        COLLECTIONS_DETAIL_URL(collectionId),
        config
      );

      const reshaped = await thunkAPI.dispatch(
        reshapeCollectionDetail(response.data)
      );
      return thunkAPI.fulfillWithValue(reshaped);
    } catch (error) {
      if (error.response) thunkAPI.dispatch(resetAuth(error.response.status));
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const findCollectionDetail =
  (collectionId) => async (dispatch, getState) => {
    const { collections } = getState().collection;
    const found = collections.find(
      (collection) => collection.id === collectionId
    );

    if (found) return { payload: found };
    else return dispatch(getCollectionDetail({ collectionId }));
  };

export const createCollection = createAsyncThunk(
  "collection/createCollection",
  async ({ name, bannerUrl, description, topics }, thunkAPI) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      withCredentials: true,
    };
    const body = JSON.stringify({
      name: name,
      banner_url: bannerUrl,
      description: description,
      topics_ids: topics.map((topic) => topic.id),
    });
    try {
      const response = await axios.post(COLLECTIONS_CREATE_URL, body, config);
      return response.data;
    } catch (error) {
      if (error.response) thunkAPI.dispatch(resetAuth(error.response.status));
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const removeCollection = createAsyncThunk(
  "collection/removeCollection",
  async ({ collectionId }, thunkAPI) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      withCredentials: true,
    };
    const body = JSON.stringify({});
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.delete(
        COLLECTIONS_REMOVE_URL(collectionId),
        body,
        config
      );
      return collectionId;
    } catch (error) {
      if (error.response) thunkAPI.dispatch(resetAuth(error.response.status));
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteCollection = createAsyncThunk(
  "collection/deleteCollection",
  async ({ collectionId }, thunkAPI) => {
    const config = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
      withCredentials: true,
    };
    const body = JSON.stringify({});
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.delete(
        COLLECTIONS_DELETE_URL(collectionId),
        body,
        config
      );
      return collectionId;
    } catch (error) {
      if (error.response) thunkAPI.dispatch(resetAuth(error.response.status));
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateUnitInCollections =
  (collection_id, unit_id, payload) => async (dispatch, getState) => {
    const { collections } = getState().collection;
    const newCollections = collections.map((element) =>
      element.id === collection_id
        ? {
            ...element,
            units: element.units.map((ele) =>
              ele.id === unit_id
                ? {
                    ...ele,
                    ...payload,
                    date_updated: timeMs2DateTime(Date.now()),
                  }
                : ele
            ),
          }
        : element
    );

    dispatch(setCollections(newCollections));
  };

const initialState = {
  isLoading: false,
  isError: false,
  message: null,
  collections: [],
  collectionsLearning: null,
};

export const collectionSlice = createSlice({
  name: "collection",
  initialState,
  reducers: {
    setCollections: (state, action) => {
      state.collections = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCollectionsLearning.pending, (state, action) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getCollectionsLearning.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.collectionsLearning = action.payload;
      })
      .addCase(getCollectionsLearning.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.collectionsLearning = [];
      })

      .addCase(getCollections.pending, (state, action) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getCollections.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(getCollections.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })

      .addCase(searchCollections.pending, (state, action) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(searchCollections.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
      })
      .addCase(searchCollections.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })

      .addCase(getCollectionDetail.pending, (state, action) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getCollectionDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.collections.push(action.payload);
      })
      .addCase(getCollectionDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })

      .addCase(createCollection.pending, (state, action) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(createCollection.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.collections.unshift(action.payload);
      })
      .addCase(createCollection.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })

      .addCase(removeCollection.pending, (state, action) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(removeCollection.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;

        // remove from learning list
        if (state.collectionsLearning) {
          const neu = state.collectionsLearning.filter(
            (element) => element.id !== action.payload
          );
          state.collectionsLearning = neu;
        }

        // update learning status
        const found = state.collections.find(
          (element) => element.id === action.payload
        );
        if (found) {
          const neu = state.collections.map((element) =>
            element.id === action.payload
              ? {
                  ...element,
                  is_learning: false,
                }
              : element
          );
          state.collections = neu;

          // state.collections.map((element) => {
          //   if (element.id === action.payload) element.is_learning = false;
          //   return element;
          // });
        }
      })
      .addCase(removeCollection.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })

      .addCase(deleteCollection.pending, (state, action) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(deleteCollection.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;

        const neu = state.collections.filter(
          (element) => element.id !== action.payload
        );
        state.collections = neu;
      })
      .addCase(deleteCollection.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export const { setCollections } = collectionSlice.actions;

export default collectionSlice.reducer;
