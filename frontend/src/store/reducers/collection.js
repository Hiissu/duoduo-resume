import {
  CREATE_COLLECTION_SUCCESS,
  CREATE_WORD_TRAN_SUCCESS,
  DELETE_COLLECTION_SUCCESS,
  DELETE_WORD_TRAN_SUCCESS,
  LEARN_COLLECTION_SUCCESS,
  LOAD_COLLECTIONS_LEARNING_FAIL,
  LOAD_COLLECTIONS_LEARNING_SUCCESS,
  LOAD_COLLECTION_SUCCESS,
  LOAD_REVIEW_COLLECTION_SUCCESS,
  REMOVE_COLLECTION_SUCCESS,
  UPDATE_POINTS_IN_COLLECTION,
  UPDATE_WORDS_IN_COLLECTION,
  UPDATE_WORD_TRAN_SUCCESS,
  REMOVE_WORD_TRAN_SUCCESS,
  USE_WORD_TRAN_SUCCESS,
} from "../actions/types";

const initialState = {
  collectionsLearning: null,
  collections: [],
  reviews: [],
};

export default function CollectionsReducer(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case LOAD_COLLECTION_SUCCESS:
      if (!state.collections.some((collection) => collection.id === payload.id))
        return {
          ...state,
          collections: [...state.collections, payload],
        };
      else return state;

    case LOAD_REVIEW_COLLECTION_SUCCESS:
      if (
        !state.reviews.some(
          (review) => review.collectionId === payload.collectionId
        )
      )
        return {
          ...state,
          reviews: [...state.reviews, payload],
        };
      else return state;

    case UPDATE_POINTS_IN_COLLECTION:
      return {
        ...state,
        collections: state.collections.map((collection) =>
          collection.id === payload.collection_id
            ? {
                ...collection,
                unknown_words: payload.unknownWordsInUnit,
                unknown_phrases: payload.unknownPhrasesInUnit,
                unknown_sentences: payload.unknownSentencesInUnit,
              }
            : collection
        ),
      };

    case UPDATE_WORDS_IN_COLLECTION:
      return {
        ...state,
        collections: state.collections.map((collection) =>
          collection.id === payload.collection_id
            ? {
                ...collection,
                words: [
                  ...collection.words.filter(
                    (wil) =>
                      !payload.wordsInRemoveList.some(
                        (word) => word.id === wil.id
                      )
                  ),
                  ...payload.wordsInAddList,
                ],
                unknown_words: payload.unknownWordsInUnit,
              }
            : collection
        ),
      };

    case CREATE_WORD_TRAN_SUCCESS:
      return {
        ...state,
        collections: state.collections.map((collection) =>
          collection.words.some((wil) => wil.id === payload.word_id)
            ? {
                ...collection,
                word_trans_created: [...collection.word_trans_created, payload],
              }
            : collection
        ),
      };

    case UPDATE_WORD_TRAN_SUCCESS:
      return {
        ...state,
        collections: state.collections.map((collection) =>
          collection.words.some((wil) => wil.id === payload.word_id)
            ? {
                ...collection,
                word_trans_created: collection.word_trans_created.map((tran) =>
                  tran.id === payload.translation.id
                    ? payload.translation
                    : tran
                ),
              }
            : collection
        ),
      };

    case DELETE_WORD_TRAN_SUCCESS:
      return {
        ...state,
        collections: state.collections.map((collection) =>
          collection.words.some((wil) => wil.id === payload.word_id)
            ? {
                ...collection,
                word_trans_created: collection.word_trans_created.filter(
                  (tran) => tran.id !== payload.tran_id
                ),
              }
            : collection
        ),
      };

    // case USE_WORD_TRAN_SUCCESS:
    //   return {
    //     ...state,
    //     collections: state.collections.map((collection) =>
    //       collection.words.some((wil) => wil.id === payload.word_id)
    //         ? {
    //             ...collection,
    //             word_trans_using: [
    //               ...collection.word_trans_using,
    //               payload.translation,
    //             ],
    //           }
    //         : collection
    //     ),
    //   };

    // case REMOVE_WORD_TRAN_SUCCESS:
    //   return {
    //     ...state,
    //     collections: state.collections.map((collection) =>
    //       collection.words.some((wil) => wil.id === payload.word_id)
    //         ? {
    //             ...collection,
    //             word_trans_using: collection.word_trans_using.filter(
    //               (tran) => tran.id !== payload.tran_id
    //             ),
    //           }
    //         : collection
    //     ),
    //   };

    case LOAD_COLLECTIONS_LEARNING_SUCCESS:
      return {
        ...state,
        collectionsLearning: payload,
      };
    case CREATE_COLLECTION_SUCCESS:
      // const newCollectionsLearning = state.collectionsLearning.unshift(payload) just return payload
      return {
        ...state,
        collectionsLearning: [...state.collectionsLearning, payload],
      };
    case LEARN_COLLECTION_SUCCESS:
      // edit loadedCollection tooo maybe

      return {
        ...state,
        collectionsLearning: [...state.collectionsLearning, payload],
      };
    case REMOVE_COLLECTION_SUCCESS:
    case DELETE_COLLECTION_SUCCESS:
      // let newCollections = state.collections;
      // newCollections.forEach((collection) => { if (collection.id === payload.id) collection.is_learning = false;});

      // edit loadedCollection tooo maybe
      const newCollectionsLearning = state.collectionsLearning.filter(
        (lo) => lo.id !== payload.id
      );

      return {
        ...state,
        collectionsLearning: newCollectionsLearning,
      };
    case LOAD_COLLECTIONS_LEARNING_FAIL:
      return { ...state, collectionsLearning: [] };
    default:
      return state;
  }
}
