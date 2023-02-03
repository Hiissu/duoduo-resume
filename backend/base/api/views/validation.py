import json
import random
import secrets
import string
import time

from base.models import *

username_regex = r"^(?![_.])(?![\d])(?!.*\.\.)(?!.*\.$)(?=.*[a-z])[a-z0-9._]{3,}$"
email_regex = r"^[A-Za-z0-9._+-]+@[A-Za-z0-9]+\.[A-Z|a-z]{2,}$"
password_regex = r"^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z`~!@#$%^&*()-_+={}[\]|\\'\";:/?>.<,]{8,}$"
# r"^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;\"'<>,./?]).{8,}$"


pos_dict = {
    "noun": "noun",
    "verb": "verb",
    "adverb": "adverb",
    "adjective": "adjective",
    "pronoun": "pronoun",
    "preposition": "preposition",
    "conjunction": "conjunction",
    "determiner": "determiner",
    "interjection": "interjection",
    "undefined": "undefined",
}

# "processing": 1,
status_type = {
    "pending": 0,
    "approved": 1,
    "rejected": 2,
}

cefr_levels = [
    "A1",
    "A2",
    "B1",
    "B2",
    "C1",
    "C2",
]


def is_json(json_data):
    try:
        json.loads(json_data)
    except ValueError as err:
        return False
    return True


def int_time_ms():
    # int(time.time_ns()/1000000)
    return int(time.time() * 1000)


def random_int():
    # num_list = random.sample(range(0, 10), 8)
    return str(random.randint(0, 99999999)).rjust(8, "0")


def random_int_char(size=8, chars=string.ascii_uppercase + string.digits):
    # chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    return "".join(secrets.choice(chars) for _ in range(size))


def is_request_valid(request_data, key_list):
    if not isinstance(request_data, dict):
        return False
    elif (len(request_data.keys()) > len(key_list)) or (
        any(key not in request_data for key in key_list)
    ):
        return False
    else:
        return True


# for Unit
def dumps_none_list(a_list):
    if a_list is None:
        return None
    return json.dumps(a_list)


def is_list_or_none(a_list, is_int):
    if isinstance(a_list, list):
        if is_int:
            if any(not isinstance(ele, int) for ele in a_list):
                return False
        return True
    elif a_list is None:
        return True
    return False


# end for
# for Translation
def is_document_valid(document):
    key_list = ("name", "content")

    if not is_request_valid(document, key_list):
        return False
    return True


def is_defmean_valid(definitions, meanings):
    for definition in definitions:
        if (not isinstance(definition, str)) or len(definition) > 2020:
            return False

    key_meanings_list = ("meaning", "reverses")
    for mean in meanings:
        if not is_request_valid(mean, key_meanings_list):
            return False

        meaning = mean["meaning"]
        reverses = mean["reverses"]

        if (not isinstance(meaning, str)) or (not isinstance(reverses, list)):
            return False
        elif (len(meaning) < 1) or (len(meaning) > 2020) or (len(reverses) > 22):
            return False

        for reverse in reverses:
            if (not isinstance(reverse, str)) or (len(reverse) > 2020):
                return False

    return True


def is_wose_translation_valid(translation):
    # ~ for word & phrase translation

    key_list = ("image_url", "ipa", "trans")
    if not is_request_valid(translation, key_list):
        return False

    image_url = translation["image_url"]
    ipa = translation["ipa"]
    trans = translation["trans"]

    if (
        (not isinstance(image_url, str))
        or (not isinstance(ipa, str))
        or (not isinstance(trans, list))
    ):
        return False

    pos_list = list(pos_dict.keys())
    if (len(image_url) > 2020) or (len(ipa) > 220) or (len(trans) > len(pos_list)):
        return False

    key_trans_list = ("pos", "definitions", "meanings", "note")
    for tran in trans:
        if not is_request_valid(tran, key_trans_list):
            return False

        pos = tran["pos"]
        definitions = tran["definitions"]
        meanings = tran["meanings"]
        note = tran["note"]

        if (
            (not isinstance(pos, str))
            or (not isinstance(definitions, list))
            or (not isinstance(meanings, list))
            or (not isinstance(note, str))
        ):
            return False
        elif (
            (pos not in pos_list)
            or len(definitions) > 22
            or len(meanings) > 22
            or len(note) > 220
        ):
            return False
        elif not is_defmean_valid(definitions, meanings):
            return False

    return True


def is_sece_translation_valid(translation):
    # ~ for sentence translation

    key_list = ("image_url", "ipa", "definitions", "meanings", "note")

    if not is_request_valid(translation, key_list):
        return False

    image_url = translation["image_url"]
    ipa = translation["ipa"]
    definitions = translation["definitions"]
    meanings = translation["meanings"]
    note = translation["note"]

    if (
        (not isinstance(image_url, str))
        or (not isinstance(ipa, str))
        or (not isinstance(definitions, list))
        or (not isinstance(meanings, list))
        or (not isinstance(note, str))
    ):
        return False

    if (len(image_url) > 2020) or (len(ipa) > 220) or (len(note) > 220):
        return False
    elif not is_defmean_valid(definitions, meanings):
        return False

    return True


def is_request_logs_valid(request_logs):
    key_list = ("id", "response", "status_type")

    if not is_request_valid(request_logs, key_list):
        return False

    request_id = request_logs["id"]
    response = request_logs["response"]
    status_type = request_logs["status_type"]

    if (
        (not isinstance(request_id, int))
        or ((not isinstance(response, str)) or (response is not None))
        or (not isinstance(status_type, int))
    ):
        return False

    return True


# end for
# for Learned
def is_learned_valid(learned_list):
    if learned_list is None:
        return True
    elif len(learned_list) > 20:
        return False

    ids_exist = []
    key_list = ("id", "writing", "reading", "speaking", "listening")

    for learn_elem in learned_list:
        if not is_request_valid(learn_elem, key_list):
            return False

        id = learn_elem["id"]
        if (not isinstance(id, int)) or (id in ids_exist):
            return False
        else:
            if id < 0:
                return False
            else:
                ids_exist.append(id)

        writing = learn_elem["writing"]
        reading = learn_elem["reading"]
        speaking = learn_elem["speaking"]
        listening = learn_elem["listening"]

        if (
            (not isinstance(writing, int))
            or (not isinstance(reading, int))
            or (not isinstance(speaking, int))
            or (not isinstance(listening, int))
        ):
            return False
        elif writing < 0 or reading < 0 or speaking < 0 or listening < 0:
            return False

    return True


def update_old_learned(old_learned, new_learned, current_time):
    if old_learned is None:
        old_learned = []

    if new_learned is None:
        return old_learned

    for element in new_learned:
        old_index = next(
            (i for i, e in enumerate(old_learned) if e["id"] == element["id"]), -1
        )
        if old_index > -1:
            if (
                element["writing"]
                + element["reading"]
                + element["speaking"]
                + element["listening"]
                > 100
            ):
                pass
            else:
                element_learned = old_learned[old_index]
                old_learned[old_index] = {
                    "id": element["id"],
                    "writing": element_learned["writing"] + element["writing"],
                    "reading": element_learned["reading"] + element["reading"],
                    "speaking": element_learned["speaking"] + element["speaking"],
                    "listening": element_learned["listening"] + element["listening"],
                    "last_practice": current_time,
                }
        else:
            new_element = {
                "id": element["id"],
                "writing": element["writing"],
                "reading": element["reading"],
                "speaking": element["speaking"],
                "listening": element["listening"],
                "last_practice": current_time,
            }
            old_learned.append(new_element)
    return old_learned


# end for
