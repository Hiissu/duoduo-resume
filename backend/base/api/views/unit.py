import json

from django.conf import settings
from django.db import connection, reset_queries, transaction
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from base.api.queries.authentication import *
from base.api.queries.fetch import *
from base.api.queries.phrase_translation import *
from base.api.queries.profile import *
from base.api.queries.sentence_translation import *
from base.api.queries.unit import *
from base.api.queries.word_translation import *
from base.api.views.validation import *
from base.api.views.throttling import *
from base.models import *


@method_decorator(csrf_protect, name="dispatch")
class UnitGetDeleteView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]
    throttle_classes = [
        GetUnitRateThrottle,
        DeleteUnitRateThrottle,
    ]

    def get(self, request, unit_id):
        try:
            with connection.cursor() as cursor:
                user = request.user
                user_id = user.id

                cursor.execute(
                    get_detail_unit(),
                    {
                        "user_id": user_id,
                        "unit_id": unit_id,
                    },
                )
                unit_detail = dictfetchall(cursor)[0]

                if unit_detail["id"] is None:
                    return Response(
                        {"message": "Unit does not exist"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                return Response(unit_detail, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"{type(e)} {e}")
            return Response(
                {"message": "Something went wrong when retrieving unit detail"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def delete(self, request, unit_id):
        try:
            with connection.cursor() as cursor:
                with transaction.atomic():
                    user = request.user
                    user_id = user.id

                    cursor.execute(
                        delete_unit(),
                        {
                            "user_id": user_id,
                            "unit_id": unit_id,
                        },
                    )
                    unit_return = dictfetchall(cursor)[0]

                    if not unit_return["is_exist"]:
                        return Response(
                            {"message": "Unit does not exist"},
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                    elif not unit_return["is_creator"]:
                        return Response(
                            {"message": "You are not the creator"},
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                    return Response({}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"{type(e)} {e}")
            return Response(
                {"message": "Something went wrong when deleting unit"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_protect, name="dispatch")
class UnitCreateView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]
    throttle_scope = "limit_post"

    def post(self, request, collection_id):
        try:
            request_data = request.data
            key_list = ("name", "description", "cefr_level", "topics")
            #  str / str / str / str list

            if not is_request_valid(request_data, key_list):
                return Response(
                    {"message": "Invalid params"}, status=status.HTTP_400_BAD_REQUEST
                )

            name = request_data["name"]
            description = request_data["description"]
            cefr_level = request_data["cefr_level"]
            topics = request_data["topics"]

            if (
                (not isinstance(name, str))
                or (not isinstance(description, str))
                or (not isinstance(cefr_level, str))
                or (not isinstance(topics, list))
                or (not (0 < len(name.strip()) <= 220))
                or (len(description) > 220)
                or (cefr_level not in cefr_levels)
                or (len(topics) > 22)
                or (
                    any(
                        (not isinstance(ele, str))
                        or (len(ele) > 220)
                        or (len(ele.strip()) < 1)
                        for ele in topics
                    )
                )
            ):
                return Response(
                    {"message": "Invalid params"}, status=status.HTTP_400_BAD_REQUEST
                )

            normal_max = 20
            premium_max = 200

            with connection.cursor() as cursor:
                with transaction.atomic():
                    user = request.user
                    user_id = user.id

                    cursor.execute(
                        create_unit(),
                        {
                            "collection_id": collection_id,
                            "user_id": user_id,
                            "name": name,
                            "description": description,
                            "cefr_level": cefr_level,
                            "normal_max": normal_max,
                            "premium_max": premium_max,
                        },
                    )
                    unit_return = dictfetchall(cursor)[0]
                    if not unit_return["is_exist"]:
                        return Response(
                            {"message": "Collection does not exist"},
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                    elif not unit_return["is_creator"]:
                        return Response(
                            {"message": "You are not the creator"},
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                    elif unit_return["is_max"]:
                        return Response(
                            {
                                "message": "You have reached the limit for the number of units you can create"
                            },
                            status=status.HTTP_400_BAD_REQUEST,
                        )

                    new_unit = unit_return["new_unit"]
                    return Response(new_unit, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f"{type(e)} {e}")
            return Response(
                {"message": "Something went wrong when creating new unit"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_protect, name="dispatch")
class UnitPatchOverviewView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]
    throttle_scope = "limit_patch"

    def patch(self, request, unit_id):
        try:
            request_data = request.data
            key_list = ("name", "description", "cefr_level")
            # str / str / str

            if not is_request_valid(request_data, key_list):
                return Response(
                    {"message": "Invalid params"}, status=status.HTTP_400_BAD_REQUEST
                )

            name = request_data["name"]
            description = request_data["description"]
            cefr_level = request_data["cefr_level"]

            if (
                (not isinstance(name, str))
                or (not isinstance(description, str))
                or (not isinstance(cefr_level, str))
                or (not (0 < len(name.strip()) <= 220))
                or (len(description) > 220)
                or (cefr_level not in cefr_levels)
            ):
                return Response(
                    {"message": "Invalid params"}, status=status.HTTP_400_BAD_REQUEST
                )

            with connection.cursor() as cursor:
                user = request.user
                user_id = user.id

                cursor.execute(
                    update_overview_unit(),
                    {
                        "user_id": user_id,
                        "unit_id": unit_id,
                        "name": name,
                        "description": description,
                        "cefr_level": cefr_level,
                    },
                )
                unit_detail = dictfetchall(cursor)[0]

                if unit_detail["id"] is None:
                    return Response(
                        {"message": "Unit does not exist"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                elif not unit_detail["is_creator"]:
                    return Response(
                        {"message": "You are not the creator"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                return Response({}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"{type(e)} {e}")
            return Response(
                {"message": "Something went wrong when updating unit overview"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_protect, name="dispatch")
class UnitPatchCoreView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]
    throttle_scope = "patch"

    def patch(self, request, unit_id):
        try:
            request_data = request.data
            key_list = (
                "words",
                "phrases",
                "sentences",
                "unknown_words",
                "unknown_phrases",
                "unknown_sentences",
            )
            # int list / int list / int list / list / list / list

            if not is_request_valid(request_data, key_list):
                return Response(
                    {"message": "Invalid params"}, status=status.HTTP_400_BAD_REQUEST
                )

            words = request_data["words"]
            phrases = request_data["phrases"]
            sentences = request_data["sentences"]
            unknown_words = request_data["unknown_words"]
            unknown_phrases = request_data["unknown_phrases"]
            unknown_sentences = request_data["unknown_sentences"]

            if (
                (not is_list_or_none(words, True))
                or (not is_list_or_none(phrases, True))
                or (not is_list_or_none(sentences, True))
                or (not is_list_or_none(unknown_words, False))
                or (not is_list_or_none(unknown_phrases, False))
                or (not is_list_or_none(unknown_sentences, False))
            ):
                return Response(
                    {"message": "Invalid params"}, status=status.HTTP_400_BAD_REQUEST
                )

            with connection.cursor() as cursor:
                user = request.user
                user_id = user.id

                normal_max = 100
                premium_max = 300  # or based on level of Collection

                cursor.execute(
                    update_core_unit(),
                    {
                        "user_id": user_id,
                        "unit_id": unit_id,
                        "words": dumps_none_list(words),
                        "phrases": dumps_none_list(phrases),
                        "sentences": dumps_none_list(sentences),
                        "unknown_words": dumps_none_list(unknown_words),
                        "unknown_phrases": dumps_none_list(unknown_phrases),
                        "unknown_sentences": dumps_none_list(unknown_sentences),
                        "normal_max": normal_max,
                        "premium_max": premium_max,
                    },
                )
                unit_return = dictfetchall(cursor)[0]

                if not unit_return["is_exist"]:
                    return Response(
                        {"message": "Unit does not exist"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                elif not unit_return["is_creator"]:
                    return Response(
                        {"message": "You are not the creator"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                elif unit_return["is_max"]:
                    return Response(
                        {"message": "Your list has reached the maximum length"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                # elif not unit_return["is_in"]:
                #     return Response({"message": "Ids are not in the dictionary"}, status=status.HTTP_400_BAD_REQUEST)

                # remove_list = ["is_exist", "is_creator"]
                # [unit_return.pop(key, None) for key in remove_list]

                return Response({}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"{type(e)} {e}")
            return Response(
                {"message": "Something went wrong when updating unit core"},
                status=status.HTTP_400_BAD_REQUEST,
            )
