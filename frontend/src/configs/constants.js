export const lexicalVersion = "0.7.0";
export const wordTranslationVersion = "0.0.1";
export const phraseTranslationVersion = "0.0.1";
export const sentenceTranslationVersion = "0.0.1";

export const bannerDefaultUrl =
  "https://images.unsplash.com/photo-1527901031195-a21e7b21052c";

export const languageLevels = [
  { cefr_level: "A1", class_level: "Beginner" },
  { cefr_level: "A2", class_level: "Elementary/Pre intermediate" },
  { cefr_level: "B1", class_level: "Intermediate" },
  { cefr_level: "B2", class_level: "Upper Intermediate" },
  { cefr_level: "C1", class_level: "Advanced" },
  { cefr_level: "C2", class_level: "Proficient" },
];

export const PartOfSpeech = [
  "noun",
  "verb",
  "adverb",
  "adjective",
  "pronoun",
  "preposition",
  "conjunction",
  "determiner",
  "interjection",
  "undefined",
];

// "determiner",  | a/an, the, this, that, these, those, my, your, his, her, its, our, their, x’s (possessive ’s)
//                  Quantifiers: (a) few, fewer, (a) little, many, much, more, most, some, any, etc. Numbers: one, two, three, etc.
// interjection   | expresses feelings and emotions
// "exclamation", | oh!, ouch!, hey!, well, wow as interjection
// "conjunction", | and, but, or, nor, for, yet, so	although, because, since, unless

export const specialCharsRegex = /[`~!@#$%^&*()_|+\-=?;:'",.<>{}[]\\\/]/gi;

/*  (?![_.])  -> no _ or . at the beginning */
export const usernameRegex =
  /^(?![_.])(?![\d])(?!.*\.\.)(?!.*\.$)(?=.*[a-z])[a-z0-9._]{3,}$/;
export const emailRegex = /^[A-Za-z0-9._+-]+@[A-Za-z0-9]+\.[A-Z|a-z]{2,}$/;
export const passwordRegex =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z`~!@#$%^&*()-_+={}[\]|\\'";:/?>.<,]{8,}$/;
// At least one uppercase letter, one lowercase letter, one number and can contain special character:

/* 
At least one uppercase letter, one lowercase letter, one number and one special character:
  /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?]).{8,}$/;
--------------------------------------------------------------------------------------------
  /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+){8,}$/;
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  /(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}/
*/

// Obfuscator JS
// const awe = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAl0MQdAyrlnYYzhAGiUtb
// G9CknkaaRlsP5VHWnNaaA+6ASXkuYrBFw2KO+O62sOUhkhvVvjSqxIGxGPNcolYl
// 4QheLgr00VI2tqbSH549/y5ORP4AKJ5ZTD5pCMkAtdRM1Z/YJQweBvo46IC165Is
// ULGQCe3nq8lykPjN4TmSQhDC+DIs17VevGV5QbTpkjs5/y6bVjN2SWNXlkWdacG8
// itGnGs/TVXINugbTRt8ceg2wBCS/p178htYGJtMqOO8Lny28b2Br7j1lTpMBmmb8
// zRyoWsKW4axP72k84lw8EJvsHo6ThTrkGvPcYtAItnjVNi2NkzkPQFF4XlTS8fZf
// LQIDAQAB`;

const part1 = {
  content: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAl0MQdAyrlnYYzhAGiUtb",
};

const part2 = {
  content: "G9CknkaaRlsP5VHWnNaaA",
};

const part3 = {
  content: "6ASXkuYrBFw2KO",
};
const part4 = {
  content: "O62sOUhkhvVvjSqxIGxGPNcolYl",
};
const part5 = {
  content: "4QheLgr00VI2tqbSH549",
};
const part6 = {
  content: "y5ORP4AKJ5ZTD5pCMkAtdRM1Z",
};
const part7 = {
  content: "YJQweBvo46IC165Is",
};
const part8 = {
  content: "ULGQCe3nq8lykPjN4TmSQhDC",
};
const part9 = {
  content: "DIs17VevGV5QbTpkjs5",
};
const part10 = {
  content: "y6bVjN2SWNXlkWdacG8",
};
const part11 = {
  content: "itGnGs",
};
const part12 = {
  content: "TVXINugbTRt8ceg2wBCS",
};
const part13 = {
  content: "p178htYGJtMqOO8Lny28b2Br7j1lTpMBmmb8",
};
const part14 = {
  content: "zRyoWsKW4axP72k84lw8EJvsHo6ThTrkGvPcYtAItnjVNi2NkzkPQFF4XlTS8fZf",
};
const part15 = {
  content: "LQIDAQAB",
};

export const publicKey = `${part1.content}
${part2.content}+${part3.content}+${part4.content}
${part5.content}/${part6.content}/${part7.content}
${part8.content}+${part9.content}/${part10.content}
${part11.content}/${part12.content}/${part13.content}
${part14.content}
${part15.content}`;

// const alpha = Array.from(Array(26)).map((e, i) => i + 65);
// const alphabet = alpha.map((x) => String.fromCharCode(x));

const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
