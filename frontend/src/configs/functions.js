export const topicIds2Topics = (topicIds, categoriesNewest) => {
  let topics = [];

  categoriesNewest.forEach((category) => {
    category.topics.forEach((element) => {
      if (topicIds.some((id) => id === element.id)) topics.push(element);
    });
  });
  return topics;
};

export const arrayIds2Array = (arrayIds, arrayInDictionary) => {
  let array = [];

  arrayInDictionary.forEach((element) => {
    if (arrayIds.some((id) => id === element.id)) array.push(element);
  });
  return array;
};

export const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const getRandomArrayElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

export const fusion2Texts = (fusion) => {
  if (fusion.length < 1) return [];

  // [{type: "text" || "option", content: "" || [], }]
  const textsArray = [];
  let startIndex = 0;

  while (
    fusion.indexOf("[", startIndex) > -1 &&
    fusion.indexOf("]", startIndex) > -1
  ) {
    const indexOfStartSquareBracket = fusion.indexOf("[", startIndex);
    const indexOfEndSquareBracket = fusion.indexOf("]", startIndex);

    textsArray.push({
      type: "text",
      content: fusion.substring(startIndex, indexOfStartSquareBracket),
    });

    textsArray.push({
      type: "option",
      content: fusion
        .substring(indexOfStartSquareBracket + 1, indexOfEndSquareBracket)
        .split("/")
        .filter((op) => op.length > 0),
    });
    startIndex = indexOfEndSquareBracket + 1;
  }

  if (startIndex < fusion.length) {
    textsArray.push({
      type: "text",
      content: fusion.substring(startIndex),
    });
  }

  let count = 1;
  for (let i = 0; i < textsArray.length; i++) {
    if (count < 99) {
      const element = textsArray[i];
      if (element.type === "option") {
        if (element.content.length > 1) count *= element.content.length;
        else if (element.content.length === 1) count *= 2;
      }
    } else break;
  }

  let main = [""];
  let temp = [""];

  if (count > 99) return new Array(100);

  textsArray.forEach((element) => {
    if (element.type === "text") {
      main.forEach((m, i) => {
        main[i] = m + element.content;
      });
    } else {
      if (element.content.length > 1) {
        temp = main;
        main = [];
        element.content.forEach((iem) => {
          const newTemp = temp.map((t) => t + iem);
          main = [...main, ...newTemp]; // main.concat(newTemp);
        });
      } else if (element.content.length === 1) {
        temp = main;
        main = [];
        const newTemp = temp.map((t) => t + element.content[0]);
        const cloneTemp = temp.slice(0);
        main = [...cloneTemp, ...newTemp];
      }
    }
  });

  const censoredArray = [];
  main.forEach((ele) => {
    if (ele.trim().length > 0)
      censoredArray.push(ele.replace(/\s+/g, " ").trim());
  });

  // \s: matches any whitespace symbol: spaces, tabs, and line breaks
  // +: match one or more of the preceding tokens (referencing \s)
  // g: the g at the end indicates iterative searching throughout the full string
  return censoredArray;
};

export const array2Fusion = (array) => {
  let fusion = "[";
  const last = array.length - 1;

  array.forEach((ele, index) => {
    const appender = index === last ? ele + "]" : ele + "/";
    fusion += appender;
  });

  // if (index === array.length - 1) fusion += `${ele}]`;
  // else fusion += `${ele}/`;

  return fusion;
};

export const timeMs2DateTime = (timeMs) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const today = new Date(timeMs);
  const day = days[today.getDay()];
  let hour = today.getHours();
  let minute = today.getMinutes();

  if (minute < 10) minute = "0" + minute;

  let am_pm = "AM";
  if (hour > 12) {
    hour -= 12;
    am_pm = "PM";
  }

  const date = today.getDate();
  const month = months[today.getMonth()];
  const year = today.getFullYear();

  // eslint-disable-next-line no-unused-vars
  const dayWithTime = `${day} ${hour}:${minute} ${am_pm}`;
  // expected output: Wednesday 6:09 AM

  // or just today.toDateString();
  // expected output: Wed Dec 06 2022

  return `${month} ${date}, ${year}`;
  // expected output: Dec 06, 2022
};

export const DATETIME_NOW_INT = () => {
  const date = new Date();
  const dateDate = () => {
    if (date.getDate() <= 9) return `0${date.getDate()}`;
    else return `${date.getDate()}`;
  };

  const timeNowInt = parseInt(
    `${date.getFullYear()}${date.getMonth()}${dateDate()}`
  ); // ${date.getHours()}

  return timeNowInt;
  // expected output: 20221106 | 11 ~ Dec
};

export const isObject = (object) => {
  if (typeof object !== "object" || object === null || Array.isArray(object))
    return false;
  else if (Object.prototype.toString.call(object) !== "[object Object]")
    return false;
  return true;
};

export const isHasKeys = (object, keys) => {
  if (keys.some((key) => !object.hasOwnProperty(key))) return false;
  return true;
};

export const validateDocuments = (documents) => {
  try {
    const parsed = JSON.parse(documents);
    if (!parsed) return [];
    else if (!Array.isArray(parsed)) return [];
    // documents instanceof Array < true/false

    parsed.forEach((element) => {
      if (!isObject(element)) return [];

      const keys = ["name", "content", "version"];
      if (!isHasKeys(element, keys)) return [];
      else if (
        typeof element.name !== "string" ||
        typeof element.content !== "string" ||
        typeof element.version !== "string"
      )
        return [];

      const documentSize = new Blob([element.content]).size;
      if (element.name.length > 220 || documentSize > 83886080) return [];
    });
    return parsed;
  } catch (error) {
    return [];
  }
};

export const validateUnknownWords = (unknownWords) => {
  try {
    const parsed = JSON.parse(unknownWords);
    if (!parsed) return [];
    else if (!Array.isArray(unknownWords)) return [];

    parsed.forEach((element) => {
      const keys = ["word", "translation", "points"];

      if (!isHasKeys(element, keys)) return [];
      else if (
        typeof element.word !== "string" ||
        !isObject(element.translation) ||
        !isObject(element.points)
      )
        return [];
      else if (element.word.length > 2020) return [];

      const translationKeys = ["image_url", "ipa", "trans", "version"];
      if (!isHasKeys(element.translation, translationKeys)) return [];
      else if (
        typeof element.translation.image_url !== "string" ||
        typeof element.translation.ipa !== "string" ||
        !Array.isArray(element.translation.trans) ||
        typeof element.translation.version !== "string"
      )
        return [];

      element.translation.trans.forEach((tran) => {
        if (!isObject(tran)) return [];

        const tranKeys = ["pos", "note", "definitions", "meanings"];
        if (!isHasKeys(tran, tranKeys)) return [];
        else if (
          typeof tran.pos !== "string" ||
          typeof tran.note !== "string" ||
          !Array.isArray(tran.definitions) ||
          !Array.isArray(tran.meanings)
        )
          return [];

        tran.definitions.forEach((definition) => {
          if (typeof definition !== "string") return [];
        });

        tran.meanings.forEach((ele) => {
          if (!isObject(ele)) return [];

          const meaningKeys = ["meaning", "reverses"];
          if (!isHasKeys(ele, meaningKeys)) return [];
          else if (
            typeof ele.meaning !== "string" ||
            !Array.isArray(ele.reverses)
          )
            return [];

          ele.reverses.forEach((reverse) => {
            if (typeof reverse !== "string") return [];
          });
        });
      });

      element.points.forEach((ele) => {
        if (!isObject(ele)) return [];

        const pointKeys = [
          "writing",
          "reading",
          "speaking",
          "listening",
          "last_practiced",
        ];
        if (!isHasKeys(ele, pointKeys)) return [];
        else if (
          !Number.isInteger(ele.writing) ||
          !Number.isInteger(ele.reading) ||
          !Number.isInteger(ele.speaking) ||
          !Number.isInteger(ele.listening) ||
          !Number.isInteger(ele.last_practiced)
        )
          return [];
      });
    });

    return parsed;
  } catch (error) {
    return [];
  }
};

export const validateUnknownPhrases = (unknownPhrases) => {
  return unknownPhrases;
};

export const validateUnknownSentences = (unknownSentences) => {
  return unknownSentences;
};

export const isCategoriesStoreValid = (categoriesStore) => {
  try {
    const parsed = JSON.parse(categoriesStore);
    if (!parsed) return false;
    else if (!isObject(parsed)) return false;

    const keys = ["categories", "exp"];
    if (!isHasKeys(parsed, keys)) return false;
    else if (!Array.isArray(parsed.categories)) return false;

    parsed.categories.forEach((element) => {
      const categoryKeys = ["id", "name", "topics"];

      if (!isHasKeys(element, categoryKeys)) return false;
      else if (
        typeof element.id !== "number" ||
        typeof element.name !== "string" ||
        !Array.isArray(element.topics)
      )
        return false;

      element.topics.forEach((ele) => {
        if (!isObject(ele)) return false;

        const topicKeys = ["id", "name"];
        if (!isHasKeys(ele, topicKeys)) return false;
        else if (typeof ele.id !== "number" || typeof ele.name !== "string")
          return false;
      });
    });

    return true;
  } catch (error) {
    return false;
  }
};

export const isUseSpace = (language_code) => {
  const langUse = ["en", "vi", "de"];
  const langNotUse = ["ja", "kr", "cn"];

  if (langUse.includes(language_code)) return true;
  else if (langNotUse.includes(language_code)) return false;

  return false;
};

// https://stackoverflow.com/a/9667817
const Latinise = {};
Latinise.latin_map = {
  Á: "A",
  Ă: "A",
  Ắ: "A",
  Ặ: "A",
  Ằ: "A",
  Ẳ: "A",
  Ẵ: "A",
  Ǎ: "A",
  Â: "A",
  Ấ: "A",
  Ậ: "A",
  Ầ: "A",
  Ẩ: "A",
  Ẫ: "A",
  Ä: "A",
  Ǟ: "A",
  Ȧ: "A",
  Ǡ: "A",
  Ạ: "A",
  Ȁ: "A",
  À: "A",
  Ả: "A",
  Ȃ: "A",
  Ā: "A",
  Ą: "A",
  Å: "A",
  Ǻ: "A",
  Ḁ: "A",
  Ⱥ: "A",
  Ã: "A",
  Ꜳ: "AA",
  Æ: "AE",
  Ǽ: "AE",
  Ǣ: "AE",
  Ꜵ: "AO",
  Ꜷ: "AU",
  Ꜹ: "AV",
  Ꜻ: "AV",
  Ꜽ: "AY",
  Ḃ: "B",
  Ḅ: "B",
  Ɓ: "B",
  Ḇ: "B",
  Ƀ: "B",
  Ƃ: "B",
  Ć: "C",
  Č: "C",
  Ç: "C",
  Ḉ: "C",
  Ĉ: "C",
  Ċ: "C",
  Ƈ: "C",
  Ȼ: "C",
  Ď: "D",
  Ḑ: "D",
  Ḓ: "D",
  Ḋ: "D",
  Ḍ: "D",
  Ɗ: "D",
  Ḏ: "D",
  ǲ: "D",
  ǅ: "D",
  Đ: "D",
  Ƌ: "D",
  Ǳ: "DZ",
  Ǆ: "DZ",
  É: "E",
  Ĕ: "E",
  Ě: "E",
  Ȩ: "E",
  Ḝ: "E",
  Ê: "E",
  Ế: "E",
  Ệ: "E",
  Ề: "E",
  Ể: "E",
  Ễ: "E",
  Ḙ: "E",
  Ë: "E",
  Ė: "E",
  Ẹ: "E",
  Ȅ: "E",
  È: "E",
  Ẻ: "E",
  Ȇ: "E",
  Ē: "E",
  Ḗ: "E",
  Ḕ: "E",
  Ę: "E",
  Ɇ: "E",
  Ẽ: "E",
  Ḛ: "E",
  Ꝫ: "ET",
  Ḟ: "F",
  Ƒ: "F",
  Ǵ: "G",
  Ğ: "G",
  Ǧ: "G",
  Ģ: "G",
  Ĝ: "G",
  Ġ: "G",
  Ɠ: "G",
  Ḡ: "G",
  Ǥ: "G",
  Ḫ: "H",
  Ȟ: "H",
  Ḩ: "H",
  Ĥ: "H",
  Ⱨ: "H",
  Ḧ: "H",
  Ḣ: "H",
  Ḥ: "H",
  Ħ: "H",
  Í: "I",
  Ĭ: "I",
  Ǐ: "I",
  Î: "I",
  Ï: "I",
  Ḯ: "I",
  İ: "I",
  Ị: "I",
  Ȉ: "I",
  Ì: "I",
  Ỉ: "I",
  Ȋ: "I",
  Ī: "I",
  Į: "I",
  Ɨ: "I",
  Ĩ: "I",
  Ḭ: "I",
  Ꝺ: "D",
  Ꝼ: "F",
  Ᵹ: "G",
  Ꞃ: "R",
  Ꞅ: "S",
  Ꞇ: "T",
  Ꝭ: "IS",
  Ĵ: "J",
  Ɉ: "J",
  Ḱ: "K",
  Ǩ: "K",
  Ķ: "K",
  Ⱪ: "K",
  Ꝃ: "K",
  Ḳ: "K",
  Ƙ: "K",
  Ḵ: "K",
  Ꝁ: "K",
  Ꝅ: "K",
  Ĺ: "L",
  Ƚ: "L",
  Ľ: "L",
  Ļ: "L",
  Ḽ: "L",
  Ḷ: "L",
  Ḹ: "L",
  Ⱡ: "L",
  Ꝉ: "L",
  Ḻ: "L",
  Ŀ: "L",
  Ɫ: "L",
  ǈ: "L",
  Ł: "L",
  Ǉ: "LJ",
  Ḿ: "M",
  Ṁ: "M",
  Ṃ: "M",
  Ɱ: "M",
  Ń: "N",
  Ň: "N",
  Ņ: "N",
  Ṋ: "N",
  Ṅ: "N",
  Ṇ: "N",
  Ǹ: "N",
  Ɲ: "N",
  Ṉ: "N",
  Ƞ: "N",
  ǋ: "N",
  Ñ: "N",
  Ǌ: "NJ",
  Ó: "O",
  Ŏ: "O",
  Ǒ: "O",
  Ô: "O",
  Ố: "O",
  Ộ: "O",
  Ồ: "O",
  Ổ: "O",
  Ỗ: "O",
  Ö: "O",
  Ȫ: "O",
  Ȯ: "O",
  Ȱ: "O",
  Ọ: "O",
  Ő: "O",
  Ȍ: "O",
  Ò: "O",
  Ỏ: "O",
  Ơ: "O",
  Ớ: "O",
  Ợ: "O",
  Ờ: "O",
  Ở: "O",
  Ỡ: "O",
  Ȏ: "O",
  Ꝋ: "O",
  Ꝍ: "O",
  Ō: "O",
  Ṓ: "O",
  Ṑ: "O",
  Ɵ: "O",
  Ǫ: "O",
  Ǭ: "O",
  Ø: "O",
  Ǿ: "O",
  Õ: "O",
  Ṍ: "O",
  Ṏ: "O",
  Ȭ: "O",
  Ƣ: "OI",
  Ꝏ: "OO",
  Ɛ: "E",
  Ɔ: "O",
  Ȣ: "OU",
  Ṕ: "P",
  Ṗ: "P",
  Ꝓ: "P",
  Ƥ: "P",
  Ꝕ: "P",
  Ᵽ: "P",
  Ꝑ: "P",
  Ꝙ: "Q",
  Ꝗ: "Q",
  Ŕ: "R",
  Ř: "R",
  Ŗ: "R",
  Ṙ: "R",
  Ṛ: "R",
  Ṝ: "R",
  Ȑ: "R",
  Ȓ: "R",
  Ṟ: "R",
  Ɍ: "R",
  Ɽ: "R",
  Ꜿ: "C",
  Ǝ: "E",
  Ś: "S",
  Ṥ: "S",
  Š: "S",
  Ṧ: "S",
  Ş: "S",
  Ŝ: "S",
  Ș: "S",
  Ṡ: "S",
  Ṣ: "S",
  Ṩ: "S",
  Ť: "T",
  Ţ: "T",
  Ṱ: "T",
  Ț: "T",
  Ⱦ: "T",
  Ṫ: "T",
  Ṭ: "T",
  Ƭ: "T",
  Ṯ: "T",
  Ʈ: "T",
  Ŧ: "T",
  Ɐ: "A",
  Ꞁ: "L",
  Ɯ: "M",
  Ʌ: "V",
  Ꜩ: "TZ",
  Ú: "U",
  Ŭ: "U",
  Ǔ: "U",
  Û: "U",
  Ṷ: "U",
  Ü: "U",
  Ǘ: "U",
  Ǚ: "U",
  Ǜ: "U",
  Ǖ: "U",
  Ṳ: "U",
  Ụ: "U",
  Ű: "U",
  Ȕ: "U",
  Ù: "U",
  Ủ: "U",
  Ư: "U",
  Ứ: "U",
  Ự: "U",
  Ừ: "U",
  Ử: "U",
  Ữ: "U",
  Ȗ: "U",
  Ū: "U",
  Ṻ: "U",
  Ų: "U",
  Ů: "U",
  Ũ: "U",
  Ṹ: "U",
  Ṵ: "U",
  Ꝟ: "V",
  Ṿ: "V",
  Ʋ: "V",
  Ṽ: "V",
  Ꝡ: "VY",
  Ẃ: "W",
  Ŵ: "W",
  Ẅ: "W",
  Ẇ: "W",
  Ẉ: "W",
  Ẁ: "W",
  Ⱳ: "W",
  Ẍ: "X",
  Ẋ: "X",
  Ý: "Y",
  Ŷ: "Y",
  Ÿ: "Y",
  Ẏ: "Y",
  Ỵ: "Y",
  Ỳ: "Y",
  Ƴ: "Y",
  Ỷ: "Y",
  Ỿ: "Y",
  Ȳ: "Y",
  Ɏ: "Y",
  Ỹ: "Y",
  Ź: "Z",
  Ž: "Z",
  Ẑ: "Z",
  Ⱬ: "Z",
  Ż: "Z",
  Ẓ: "Z",
  Ȥ: "Z",
  Ẕ: "Z",
  Ƶ: "Z",
  Ĳ: "IJ",
  Œ: "OE",
  ᴀ: "A",
  ᴁ: "AE",
  ʙ: "B",
  ᴃ: "B",
  ᴄ: "C",
  ᴅ: "D",
  ᴇ: "E",
  ꜰ: "F",
  ɢ: "G",
  ʛ: "G",
  ʜ: "H",
  ɪ: "I",
  ʁ: "R",
  ᴊ: "J",
  ᴋ: "K",
  ʟ: "L",
  ᴌ: "L",
  ᴍ: "M",
  ɴ: "N",
  ᴏ: "O",
  ɶ: "OE",
  ᴐ: "O",
  ᴕ: "OU",
  ᴘ: "P",
  ʀ: "R",
  ᴎ: "N",
  ᴙ: "R",
  ꜱ: "S",
  ᴛ: "T",
  ⱻ: "E",
  ᴚ: "R",
  ᴜ: "U",
  ᴠ: "V",
  ᴡ: "W",
  ʏ: "Y",
  ᴢ: "Z",
  á: "a",
  ă: "a",
  ắ: "a",
  ặ: "a",
  ằ: "a",
  ẳ: "a",
  ẵ: "a",
  ǎ: "a",
  â: "a",
  ấ: "a",
  ậ: "a",
  ầ: "a",
  ẩ: "a",
  ẫ: "a",
  ä: "a",
  ǟ: "a",
  ȧ: "a",
  ǡ: "a",
  ạ: "a",
  ȁ: "a",
  à: "a",
  ả: "a",
  ȃ: "a",
  ā: "a",
  ą: "a",
  ᶏ: "a",
  ẚ: "a",
  å: "a",
  ǻ: "a",
  ḁ: "a",
  ⱥ: "a",
  ã: "a",
  ꜳ: "aa",
  æ: "ae",
  ǽ: "ae",
  ǣ: "ae",
  ꜵ: "ao",
  ꜷ: "au",
  ꜹ: "av",
  ꜻ: "av",
  ꜽ: "ay",
  ḃ: "b",
  ḅ: "b",
  ɓ: "b",
  ḇ: "b",
  ᵬ: "b",
  ᶀ: "b",
  ƀ: "b",
  ƃ: "b",
  ɵ: "o",
  ć: "c",
  č: "c",
  ç: "c",
  ḉ: "c",
  ĉ: "c",
  ɕ: "c",
  ċ: "c",
  ƈ: "c",
  ȼ: "c",
  ď: "d",
  ḑ: "d",
  ḓ: "d",
  ȡ: "d",
  ḋ: "d",
  ḍ: "d",
  ɗ: "d",
  ᶑ: "d",
  ḏ: "d",
  ᵭ: "d",
  ᶁ: "d",
  đ: "d",
  ɖ: "d",
  ƌ: "d",
  ı: "i",
  ȷ: "j",
  ɟ: "j",
  ʄ: "j",
  ǳ: "dz",
  ǆ: "dz",
  é: "e",
  ĕ: "e",
  ě: "e",
  ȩ: "e",
  ḝ: "e",
  ê: "e",
  ế: "e",
  ệ: "e",
  ề: "e",
  ể: "e",
  ễ: "e",
  ḙ: "e",
  ë: "e",
  ė: "e",
  ẹ: "e",
  ȅ: "e",
  è: "e",
  ẻ: "e",
  ȇ: "e",
  ē: "e",
  ḗ: "e",
  ḕ: "e",
  ⱸ: "e",
  ę: "e",
  ᶒ: "e",
  ɇ: "e",
  ẽ: "e",
  ḛ: "e",
  ꝫ: "et",
  ḟ: "f",
  ƒ: "f",
  ᵮ: "f",
  ᶂ: "f",
  ǵ: "g",
  ğ: "g",
  ǧ: "g",
  ģ: "g",
  ĝ: "g",
  ġ: "g",
  ɠ: "g",
  ḡ: "g",
  ᶃ: "g",
  ǥ: "g",
  ḫ: "h",
  ȟ: "h",
  ḩ: "h",
  ĥ: "h",
  ⱨ: "h",
  ḧ: "h",
  ḣ: "h",
  ḥ: "h",
  ɦ: "h",
  ẖ: "h",
  ħ: "h",
  ƕ: "hv",
  í: "i",
  ĭ: "i",
  ǐ: "i",
  î: "i",
  ï: "i",
  ḯ: "i",
  ị: "i",
  ȉ: "i",
  ì: "i",
  ỉ: "i",
  ȋ: "i",
  ī: "i",
  į: "i",
  ᶖ: "i",
  ɨ: "i",
  ĩ: "i",
  ḭ: "i",
  ꝺ: "d",
  ꝼ: "f",
  ᵹ: "g",
  ꞃ: "r",
  ꞅ: "s",
  ꞇ: "t",
  ꝭ: "is",
  ǰ: "j",
  ĵ: "j",
  ʝ: "j",
  ɉ: "j",
  ḱ: "k",
  ǩ: "k",
  ķ: "k",
  ⱪ: "k",
  ꝃ: "k",
  ḳ: "k",
  ƙ: "k",
  ḵ: "k",
  ᶄ: "k",
  ꝁ: "k",
  ꝅ: "k",
  ĺ: "l",
  ƚ: "l",
  ɬ: "l",
  ľ: "l",
  ļ: "l",
  ḽ: "l",
  ȴ: "l",
  ḷ: "l",
  ḹ: "l",
  ⱡ: "l",
  ꝉ: "l",
  ḻ: "l",
  ŀ: "l",
  ɫ: "l",
  ᶅ: "l",
  ɭ: "l",
  ł: "l",
  ǉ: "lj",
  ſ: "s",
  ẜ: "s",
  ẛ: "s",
  ẝ: "s",
  ḿ: "m",
  ṁ: "m",
  ṃ: "m",
  ɱ: "m",
  ᵯ: "m",
  ᶆ: "m",
  ń: "n",
  ň: "n",
  ņ: "n",
  ṋ: "n",
  ȵ: "n",
  ṅ: "n",
  ṇ: "n",
  ǹ: "n",
  ɲ: "n",
  ṉ: "n",
  ƞ: "n",
  ᵰ: "n",
  ᶇ: "n",
  ɳ: "n",
  ñ: "n",
  ǌ: "nj",
  ó: "o",
  ŏ: "o",
  ǒ: "o",
  ô: "o",
  ố: "o",
  ộ: "o",
  ồ: "o",
  ổ: "o",
  ỗ: "o",
  ö: "o",
  ȫ: "o",
  ȯ: "o",
  ȱ: "o",
  ọ: "o",
  ő: "o",
  ȍ: "o",
  ò: "o",
  ỏ: "o",
  ơ: "o",
  ớ: "o",
  ợ: "o",
  ờ: "o",
  ở: "o",
  ỡ: "o",
  ȏ: "o",
  ꝋ: "o",
  ꝍ: "o",
  ⱺ: "o",
  ō: "o",
  ṓ: "o",
  ṑ: "o",
  ǫ: "o",
  ǭ: "o",
  ø: "o",
  ǿ: "o",
  õ: "o",
  ṍ: "o",
  ṏ: "o",
  ȭ: "o",
  ƣ: "oi",
  ꝏ: "oo",
  ɛ: "e",
  ᶓ: "e",
  ɔ: "o",
  ᶗ: "o",
  ȣ: "ou",
  ṕ: "p",
  ṗ: "p",
  ꝓ: "p",
  ƥ: "p",
  ᵱ: "p",
  ᶈ: "p",
  ꝕ: "p",
  ᵽ: "p",
  ꝑ: "p",
  ꝙ: "q",
  ʠ: "q",
  ɋ: "q",
  ꝗ: "q",
  ŕ: "r",
  ř: "r",
  ŗ: "r",
  ṙ: "r",
  ṛ: "r",
  ṝ: "r",
  ȑ: "r",
  ɾ: "r",
  ᵳ: "r",
  ȓ: "r",
  ṟ: "r",
  ɼ: "r",
  ᵲ: "r",
  ᶉ: "r",
  ɍ: "r",
  ɽ: "r",
  ↄ: "c",
  ꜿ: "c",
  ɘ: "e",
  ɿ: "r",
  ś: "s",
  ṥ: "s",
  š: "s",
  ṧ: "s",
  ş: "s",
  ŝ: "s",
  ș: "s",
  ṡ: "s",
  ṣ: "s",
  ṩ: "s",
  ʂ: "s",
  ᵴ: "s",
  ᶊ: "s",
  ȿ: "s",
  ɡ: "g",
  ᴑ: "o",
  ᴓ: "o",
  ᴝ: "u",
  ť: "t",
  ţ: "t",
  ṱ: "t",
  ț: "t",
  ȶ: "t",
  ẗ: "t",
  ⱦ: "t",
  ṫ: "t",
  ṭ: "t",
  ƭ: "t",
  ṯ: "t",
  ᵵ: "t",
  ƫ: "t",
  ʈ: "t",
  ŧ: "t",
  ᵺ: "th",
  ɐ: "a",
  ᴂ: "ae",
  ǝ: "e",
  ᵷ: "g",
  ɥ: "h",
  ʮ: "h",
  ʯ: "h",
  ᴉ: "i",
  ʞ: "k",
  ꞁ: "l",
  ɯ: "m",
  ɰ: "m",
  ᴔ: "oe",
  ɹ: "r",
  ɻ: "r",
  ɺ: "r",
  ⱹ: "r",
  ʇ: "t",
  ʌ: "v",
  ʍ: "w",
  ʎ: "y",
  ꜩ: "tz",
  ú: "u",
  ŭ: "u",
  ǔ: "u",
  û: "u",
  ṷ: "u",
  ü: "u",
  ǘ: "u",
  ǚ: "u",
  ǜ: "u",
  ǖ: "u",
  ṳ: "u",
  ụ: "u",
  ű: "u",
  ȕ: "u",
  ù: "u",
  ủ: "u",
  ư: "u",
  ứ: "u",
  ự: "u",
  ừ: "u",
  ử: "u",
  ữ: "u",
  ȗ: "u",
  ū: "u",
  ṻ: "u",
  ų: "u",
  ᶙ: "u",
  ů: "u",
  ũ: "u",
  ṹ: "u",
  ṵ: "u",
  ᵫ: "ue",
  ꝸ: "um",
  ⱴ: "v",
  ꝟ: "v",
  ṿ: "v",
  ʋ: "v",
  ᶌ: "v",
  ⱱ: "v",
  ṽ: "v",
  ꝡ: "vy",
  ẃ: "w",
  ŵ: "w",
  ẅ: "w",
  ẇ: "w",
  ẉ: "w",
  ẁ: "w",
  ⱳ: "w",
  ẘ: "w",
  ẍ: "x",
  ẋ: "x",
  ᶍ: "x",
  ý: "y",
  ŷ: "y",
  ÿ: "y",
  ẏ: "y",
  ỵ: "y",
  ỳ: "y",
  ƴ: "y",
  ỷ: "y",
  ỿ: "y",
  ȳ: "y",
  ẙ: "y",
  ɏ: "y",
  ỹ: "y",
  ź: "z",
  ž: "z",
  ẑ: "z",
  ʑ: "z",
  ⱬ: "z",
  ż: "z",
  ẓ: "z",
  ȥ: "z",
  ẕ: "z",
  ᵶ: "z",
  ᶎ: "z",
  ʐ: "z",
  ƶ: "z",
  ɀ: "z",
  ﬀ: "ff",
  ﬃ: "ffi",
  ﬄ: "ffl",
  ﬁ: "fi",
  ﬂ: "fl",
  ĳ: "ij",
  œ: "oe",
  ﬆ: "st",
  ₐ: "a",
  ₑ: "e",
  ᵢ: "i",
  ⱼ: "j",
  ₒ: "o",
  ᵣ: "r",
  ᵤ: "u",
  ᵥ: "v",
  ₓ: "x",
};

export const latinize = (string) => {
  return string.replace(/[^A-Za-z0-9[\]]/g, (a) => {
    return Latinise.latin_map[a] || a;
  });
};
// String.prototype.latinize = String.prototype.latinise;
// String.prototype.isLatin = () => {
//   return this === this.latinise();
// };
