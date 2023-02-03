from django.db import connection, reset_queries, transaction
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from rest_framework import generics, status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from base.api.queries.fetch import *
from base.api.queries.learn import *
from base.api.queries.profile import *
from base.api.views.encryption import RSAEncryption, VigenereCipher
from base.api.views.validation import *
from base.models import *


@method_decorator(csrf_protect, name="dispatch")
class LearnedGetView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]
    throttle_scope = "limit_get"

    def get(self, request):
        try:
            with connection.cursor() as cursor:
                user = request.user
                user_id = user.id

                cursor.execute(
                    get_learned(),
                    {
                        "user_id": user_id,
                    },
                )
                learned_return = dictfetchall(cursor)[0]

                return Response(
                    {
                        "words": learned_return["words"],
                        "phrases": learned_return["phrases"],
                        "sentences": learned_return["sentences"],
                    },
                    status=status.HTTP_200_OK,
                )
        except Exception as e:
            print(f"{type(e)} {e}")
            return Response(
                {"message": "Something went wrong when retrieving learned"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_protect, name="dispatch")
class PracticeView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]
    throttle_scope = "post"

    def post(self, request):
        try:
            request_data = request.data
            key_list = (
                "words",
                "phrases",
                "sentences",
            )
            #  int list / int list / int list

            if not is_request_valid(request_data, key_list):
                return Response(
                    {"message": "Invalid params"}, status=status.HTTP_400_BAD_REQUEST
                )

            words = request_data["words"]
            phrases = request_data["phrases"]
            sentences = request_data["sentences"]

            if (
                (not is_list_or_none(words, True))
                or (not is_list_or_none(phrases, True))
                or (not is_list_or_none(sentences, True))
            ):
                return Response(
                    {"message": "Invalid params"}, status=status.HTTP_400_BAD_REQUEST
                )

            with connection.cursor() as cursor:
                user = request.user
                user_id = user.id

                cursor.execute(
                    translation_for_practice(),
                    {
                        "user_id": user_id,
                        "words": words,
                        "phrases": phrases,
                        "sentences": sentences,
                    },
                )
                tran_return = dictfetchall(cursor)[0]

                return Response(
                    {
                        "words": tran_return["words"],
                        "phrases": tran_return["phrases"],
                        "sentences": tran_return["sentences"],
                    },
                    status=status.HTTP_200_OK,
                )
        except Exception as e:
            print(f"{type(e)} {e}")
            return Response(
                {"message": "Something went wrong when practicing"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_protect, name="dispatch")
class CompleteView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]
    throttle_scope = "complete"

    def post(self, request):
        try:
            request_data = request.data
            key_list = (
                "key",
                "unit_id",
                "words",
                "phrases",
                "sentences",
                "unknown_words",
                "unknown_phrases",
                "unknown_sentences",
            )
            # str / none - int / none - list / none - list / none - list / none - list / none - list / none - list

            if not is_request_valid(request_data, key_list):
                return Response(
                    {"message": "Invalid params"}, status=status.HTTP_400_BAD_REQUEST
                )

            key = request_data["key"]
            unit_id = request_data["unit_id"]
            words = request_data["words"]
            phrases = request_data["phrases"]
            sentences = request_data["sentences"]
            unknown_words = request_data["unknown_words"]
            unknown_phrases = request_data["unknown_phrases"]
            unknown_sentences = request_data["unknown_sentences"]

            if (
                (not isinstance(key, str))
                or (not (isinstance(unit_id, int) or unit_id is None))
                or (not is_list_or_none(words, True))
                or (not is_list_or_none(phrases, True))
                or (not is_list_or_none(sentences, True))
                or (not is_list_or_none(unknown_words, False))
                or (not is_list_or_none(unknown_phrases, False))
                or (not is_list_or_none(unknown_sentences, False))
            ):
                return Response(
                    {"message": "Invalid params"}, status=status.HTTP_400_BAD_REQUEST
                )

            try:
                rsa_encryption = RSAEncryption()
                meow = json.loads(rsa_encryption.decrypt(key))

                meow_keys = ("key", "time_ms")
                # str / int /

                if not is_request_valid(meow, meow_keys):
                    return Response(
                        {"message": "Invalid key"}, status=status.HTTP_400_BAD_REQUEST
                    )

                key_meow = meow["key"]
                time_meow = meow["time_ms"]

                if not isinstance(key_meow, str) or not isinstance(time_meow, int):
                    return Response(
                        {"message": "Invalid key params"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                user = request.user
                user_id = user.id

                """@valid the key"""
                valid_key = "llun_undefined"
                plain_text = json.dumps({"user_id": user_id, "time_ms": time_meow})
                key_encrypt = json.dumps({"unit_id": unit_id, "time_ms": time_meow})

                vigenere_cipher = VigenereCipher()
                key_encrypt_generated = vigenere_cipher.generate_key(
                    plain_text, key_encrypt
                )
                secret_key = vigenere_cipher.encrypt(plain_text, key_encrypt_generated)
                decipher_key = vigenere_cipher.cipher(key_meow, secret_key, False)

                if decipher_key != valid_key:
                    return Response(
                        {"message": "Invalid key"}, status=status.HTTP_400_BAD_REQUEST
                    )
                elif (
                    (not is_learned_valid(words))
                    or (not is_learned_valid(phrases))
                    or (not is_learned_valid(sentences))
                ):
                    return Response(
                        {"message": "Invalid learned"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            except Exception as e:
                print(f"{type(e)} {e}")
                return Response(
                    {"message": "Cannot decrypt key"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            with connection.cursor() as cursor:
                """@process in sql"""
                cursor.execute(
                    complete_practice(),
                    {
                        "user_id": user_id,
                        "unit_id": unit_id,
                        "time_ms": int_time_ms(),
                        "time_meow": time_meow,
                        "words": dumps_none_list(words),
                        "phrases": dumps_none_list(phrases),
                        "sentences": dumps_none_list(sentences),
                        "unknown_words": dumps_none_list(unknown_words),
                        "unknown_phrases": dumps_none_list(unknown_phrases),
                        "unknown_sentences": dumps_none_list(unknown_sentences),
                    },
                )
                return Response({}, status=status.HTTP_200_OK)

                """ @process in python 
                cursor.execute(
                    is_learned_exist(),
                    {
                        "user_id": user_id,
                    },
                )
                learned_return = dictfetchall(cursor)[0]

                # ~ valid each ids in request
                word_ids_in_language = learned_return["word_ids"]
                for element in words:
                    # if not any(word["id"] == element["id"] for word in words_in_dictionary):
                    if element["id"] not in word_ids_in_language:
                        return Response({}, status=status.HTTP_400_BAD_REQUEST)

                phrase_ids_in_language = learned_return["phrase_ids"]
                for element in phrases:
                    if element["id"] not in phrase_ids_in_language:
                        return Response({}, status=status.HTTP_400_BAD_REQUEST)

                sentence_ids_in_language = learned_return["sentence_ids"]
                for element in sentences:
                    if element["id"] not in sentence_ids_in_language:
                        return Response({}, status=status.HTTP_400_BAD_REQUEST)

                if learned_return["is_log_exist"]:
                    if int(learned_return["time_ms"]) >= time_meow:
                        return Response({}, status=status.HTTP_400_BAD_REQUEST)

                current_time = learned_return["time_current"]
                cursor.execute(
                    update_or_create_learned(),
                    {
                        "user_id": user_id,
                        "unit_id": unit_id,
                        "language_id": learned_return["language_id"],
                        "time_ms": int_time_ms(),
                        "is_learned_exist": learned_return["is_learned_exist"],
                        "learned_id": learned_return["learned_id"],
                        "words_learned": json.dumps(
                            update_old_learned(
                                learned_return["words_learned"],
                                words,
                                current_time,
                            )
                        ),
                        "phrases_learned": json.dumps(
                            update_old_learned(
                                learned_return["phrases_learned"],
                                phrases,
                                current_time,
                            )
                        ),
                        "sentences_learned": json.dumps(
                            update_old_learned(
                                learned_return["sentences_learned"],
                                sentences,
                                current_time,
                            )
                        ),
                        "is_log_exist": learned_return["is_log_exist"],
                        "log_id": learned_return["log_id"],
                        "words_log": json.dumps(
                            update_old_learned(
                                learned_return["words_log"], words, current_time
                            )
                        ),
                        "phrases_log": json.dumps(
                            update_old_learned(
                                learned_return["phrases_log"], phrases, current_time
                            )
                        ),
                        "sentences_log": json.dumps(
                            update_old_learned(
                                learned_return["sentences_log"], sentences, current_time
                            )
                        ),
                        "unknown_words": dumps_none_list(unknown_words),
                        "unknown_phrases": dumps_none_list(unknown_phrases),
                        "unknown_sentences": dumps_none_list(unknown_sentences),
                    },
                )
                return Response({}, status=status.HTTP_200_OK)
                """

        except Exception as e:
            print(f"{type(e)} {e}")
            return Response(
                {"message": "Something went wrong when completing"},
                status=status.HTTP_400_BAD_REQUEST,
            )
