// Job.objects.filter(
//             ~Q(id__in=JobStatus.objects.values_list('job_id', flat=True).all()),
//             ...
//         )
// instead of
// Job.objects.filter(...).exclude(id__in=JobStatus.objects.values_list('job_id', flat=True).all()).delete()

// # if "key" in mydict.keys():
// # if "key" in mydict:
// # if ("one", "1") in mydict.items():

// # {
// #     'ipa': word_trans.ipa,
// #     'translations': [
// #         {
// #             'pos': trans.pos, 'def': [{definition}],
// #             'meaning': [{meaning}], 'node': trans.node,
// #         },
// #     ]
// # }

const moveUp = (e) => {
  if (e.previousElementSibling)
    e.parentNode.insertBefore(e, e.previousElementSibling);
};

const moveDown = (e) => {
  if (e.nextElementSibling) e.parentNode.insertBefore(e.nextElementSibling, e);
};

// const onClickUpnDown =       contentEditable="true"
document.querySelector("ul").addEventListener("click", (e) => {
  if (e.target.className === "down") moveDown(e.target.parentNode);
  else if (e.target.className === "up") moveUp(e.target.parentNode);
});

// myimg.parentNode.insertBefore(text, myimg.nextSibling);
// myimg.insertAdjacentHTML("afterend", "This is my caption.");
// e.target.nextSibling;         e.currentTarget.style.visibility = "hidden";

// Space or Enter key  if (e.keyCode === 32 || e.keyCode === 13)
// const inx = a.indexOf(selectionStart);  if (inx > -1) a.splice(inx, 1);

// console.log(a.toString(), lastSA.indexa == a.toString());   // compare half array

let allVoices, allLanguages, primaryLanguages, langtags, langhash, langcodehash;
let speakBtn, speakerMenuSelect, languageMenuSelect;
let voiceIndex = 0;
let initialSetup = true;

const getLanguageTags = () => {
  let langs = [
    "af-Afrikaans",
    "am-Amharic",
    "ar-Arabic",
    "bg-Bungarian",
    "bn-Bengali",
    "ca-Catalan",
    "cs-Czech",
    "cy-Welsh",
    "da-Danish",
    "de-German",
    "el-Greek",
    "en-English",
    "eo-Esperanto",
    "es-Spanish",
    "et-Estonian",
    "fa-Persian",
    "fi-Finnish",
    "fil-Filipino",
    "fr-French",
    "ga-Irish",
    "gl-Galician",
    "gu-Gujarati",
    "he-Hebrew",
    "hi-Hindi",
    "hr-Croatian",
    "hu-Hungarian",
    "id-Indonesian",
    "is-Icelandic",
    "it-Italian",
    "ja-Japanese",
    "jv-Javanese",
    "kk-Kazakh",
    "km-Khmer",
    "kn-Kannada",
    "ko-Korean",
    "la-Latin",
    "lo-Lao",
    "lt-Lithuanian",
    "lv-Latvian",
    "mk-Macedonian",
    "ml-Malayalam",
    "mr-Marathi",
    "ms-Malay",
    "mt-Maltese",
    "my-Burmese",
    "nb-Norwegian Bokmal",
    "nl-Dutch",
    "nn-Norwegian Nynorsk",
    "no-Norwegian",
    "pl-Polish",
    "ps-Pashto",
    "pt-Portuguese",
    "ro-Romanian",
    "ru-Russian",
    "si-Sinhala",
    "sk-Slovak",
    "sl-Slovenian",
    "so-Somali",
    "sq-Albanian",
    "sr-Serbian",
    "su-Sundanese",
    "sv-Swedish",
    "sw-Swahili",
    "ta-Tamil",
    "te-Telugu",
    "th-Thai",
    "tr-Turkish",
    "uk-Ukrainian",
    "ur-Urdu",
    "uz-Uzbek",
    "vi-Vietnamese",
    "zh-Chinese",
    "zu-Zulu",
  ];
  let langobjects = [];

  for (let i = 0; i < langs.length; i++) {
    let langparts = langs[i].split("-");
    langobjects.push({ code: langparts[0], name: langparts[1] });
  }
  return langobjects;
};

const getLookupTable = (objectsArray, propname) => {
  // [..., {code: 'zu', name: 'Zulu'}] -> {..., zu: {code: 'zu', name: 'Zulu'}} propname = code
  // [..., {code: 'zu', name: 'Zulu'}] ->  {..., Zulu: {code: 'zu', name: 'Zulu'}}  propname = name

  return objectsArray.reduce(
    (accumulator, currentValue) => (
      (accumulator[currentValue[propname]] = currentValue), accumulator
    ),
    {}
  );
};

const init = () => {
  speakBtn = document.querySelector("#speakBtn");
  speakerMenuSelect = document.querySelector("#speakerMenu");
  speakBtn.addEventListener("click", talk, false);
  speakerMenuSelect.addEventListener("change", onSelectSpeaker, false);

  languageMenuSelect = document.querySelector("#languageMenu");
  languageMenuSelect.addEventListener("change", onSelectLanguage, false);

  langtags = getLanguageTags();
  langhash = getLookupTable(langtags, "name");
  langcodehash = getLookupTable(langtags, "code");

  if (window.speechSynthesis) {
    if (speechSynthesis.onvoiceschanged !== undefined) {
      //Chrome gets the voices asynchronously so this is needed
      speechSynthesis.onvoiceschanged = setUpVoices;
    }
    setUpVoices(); //for all the other browsers
  } else {
    speakBtn.disabled = true;
    speakerMenuSelect.disabled = true;
    languageMenuSelect.disabled = true;
    document.querySelector("#warning").style.display = "block";
  }
};

const setUpVoices = () => {
  allVoices = getAllVoices();
  allLanguages = getAllLanguages(allVoices);
  primaryLanguages = getPrimaryLanguages(allLanguages);

  filterVoices();

  if (initialSetup && allVoices.length) {
    initialSetup = false;
    createlanguageMenuSelect();
  }
};

const talk = () => {
  let sval = Number(speakerMenuSelect.value);
  const utterance = new SpeechSynthesisUtterance();
  utterance.voice = allVoices[sval];
  utterance.lang = utterance.voice.lang;
  utterance.text = textContent;
  utterance.rate = 1;

  speechSynthesis.speak(utterance);
};

const createlanguageMenuSelect = () => {
  let code = `<option selected value="all">Show All</option>`;
  let langnames = [];

  // primaryLanguages.forEach((element) => {
  //   if (langcodehash[element] !== undefined) {
  //     langnames.push(langcodehash[element].name);
  //   }
  // });

  primaryLanguages.forEach((element) => {
    const afind = langtags.find((lang) => lang.code === element);
    if (afind !== undefined) {
      langnames.push(afind);
    }
  });

  langnames.sort();

  // langnames.forEach((lname) => {
  //   let lcode = langhash[lname].code;
  //   code += `<option value=${lcode}>${lname}</option>`;
  // });

  langnames.forEach((lang) => {
    code += `<option value=${lang.code}>${lang.name}</option>`;
  });

  console.log("code", code);

  languageMenuSelect.innerHTML = code;
};

const getAllLanguages = (voices) => {
  let langs = [];
  voices.forEach((element) => {
    // lang: "en-US",
    langs.push(element.lang.trim());
  });

  return [...new Set(langs)];
};

const getPrimaryLanguages = (langlist) => {
  let langs = [];
  langlist.forEach((element) => {
    langs.push(element.split("-")[0]);
  });
  return [...new Set(langs)];
};

const onSelectSpeaker = () => {
  voiceIndex = speakerMenuSelect.selectedIndex;
};

const onSelectLanguage = () => {
  filterVoices();
  speakerMenuSelect.selectedIndex = 0;

  const voiceIn = voices.findIndex(
    (voice) => voice.name === "Microsoft Zira - English (United States)"
  );
  console.log("voiceIn", voiceIn);
  if (voiceIn > -1) speakerMenuSelect.selectedIndex = voiceIn;
  else speakerMenuSelect.selectedIndex = 0;
};

const filterVoices = () => {
  let langcode = languageMenuSelect.value;
  voices = allVoices.filter((voice) => {
    return langcode === "all" ? true : voice.lang.indexOf(langcode + "-") >= 0;
  });

  let code = ``;
  voices.forEach((element) => {
    code += `<option value=${element.id}>${element.name} (${element.lang})</option>`;
    // code += element.voiceURI.includes(".premium") ? " (premium)" : ``; out of date `</option>`;
  });
  speakerMenuSelect.innerHTML = code;

  speakerMenuSelect.selectedIndex = voiceIndex;
};

const getAllVoices = () => {
  let voicesall = speechSynthesis.getVoices();
  let vuris = [];
  let voices = [];

  //unfortunately we have to check for duplicates
  voicesall.forEach((obj) => {
    let uri = obj.voiceURI;
    if (!vuris.includes(uri)) {
      vuris.push(uri);
      voices.push(obj);
    }
  });
  voices.forEach((obj, index) => {
    obj.id = index;
  });
  return voices;
};
