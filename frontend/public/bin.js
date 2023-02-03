// ----> another way
var index = arr.indexOf(value);
if (index > -1) arr.splice(index, 1);

// ----> ECMAScript 6
arr = arr.filter((item) => item !== value);

// ----> ECMAScript 7
let forDeletion = [2, 3, 5];
arr = arr.filter((item) => !forDeletion.includes(item));

// ----> Removing multiple items
// array-lib.js
export function remove(...forDeletion) {
  return this.filter((item) => !forDeletion.includes(item));
}

// ----> main.js
import { remove } from "./array-lib.js";
let arr = [1, 2, 3, 4, 5, 3];
// :: This-Binding Syntax Proposal using "remove" function as "virtual method" without extending Array.prototype
// arr = arr::remove(2, 3, 5);

// const newCourses = newCourses.map((course) =>
//   course.id === payload
//     ? {
//         ...course,
//         is_learning: !is_learning,
//         num_learners: num_learners + 1,
//       }
//     : course
// );

localStorage.removeItem("name");
// ----> for Session
// ----> ----> Storing data
sessionStorage.setItem("name", "Bepatient");
// ----> ----> Retrieving data
sessionStorage.getItem("name");
// ----> ----> Deleting data
sessionStorage.removeItem("name");
// ----> ----> Retrieving item key
sessionStorage.key(index);
// ----> ----> Clearing the datastore
sessionStorage.clear();
Storage.prototype.setObject = function (key, value) {
  this.setItem(key, JSON.stringify(value));
};

// Storage.prototype.getObject = function(key) {
//     var value = this.getItem(key);
//     return value && JSON.parse(value);
// }
// Because of short-circuit evaluation, getObject() will immediately return null if key is not in Storage.
//It also will not throw a SyntaxError exception if value is "" (the empty string; JSON.parse() cannot handle that).

// ----> for catch error
console.log(error.response.data);
console.log(error.response.status);
console.log(error.response.headers);
