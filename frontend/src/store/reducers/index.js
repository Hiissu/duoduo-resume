import { combineReducers } from "redux";
import authentication from "./authentication";
import category from "./category";
import collection from "./collection";
import course from "./course";
import language from "./language";
import phrase from "./phrase";
import register from "./register";
import sentence from "./sentence";
import user from "./user";
import word from "./word";

export default combineReducers({
  authentication,
  register,
  user,
  course,
  collection,
  category,
  language,
  word,
  phrase,
  sentence,
});
