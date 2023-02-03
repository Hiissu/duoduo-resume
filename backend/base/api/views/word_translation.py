import json
import math

from django.db import connection, transaction
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from base.api.queries.authentication import *
from base.api.queries.fetch import *
from base.api.queries.profile import *
from base.api.queries.word import *
from base.api.queries.word_translation import *
from base.api.views.validation import *
from base.models import *
from base.api.views.throttling import *


@method_decorator(csrf_protect, name="dispatch")
class WordTranslationGetCreateView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]
    throttle_classes = [
        GetTranslationRateThrottle,
        PostTranslationRateThrottle,
    ]

    def get(self, request, word_id):
        try:
            with connection.cursor() as cursor:
                user = request.user
                user_id = user.id

                cursor.execute(
                    get_detail_word(),
                    {
                        "word_id": word_id,
                        "user_id": user_id,
                    },
                )
                word_return = dictfetchall(cursor)[0]

                if not word_return["is_exist"]:
                    return Response(
                        {"message": "Word does not exist"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                del word_return["is_exist"]
                return Response(word_return, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"{type(e)} {e}")
            return Response(
                {"message": "Something went wrong when retrieving word translation"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def post(self, request, word_id):
        try:
            request_data = request.data
            key_list = ("translation",)  # dict

            if not is_request_valid(request_data, key_list):
                return Response(
                    {"message": "Invalid params"}, status=status.HTTP_400_BAD_REQUEST
                )

            translation = request_data["translation"]
            max_bytes = 8388608
            if len(json.dumps(translation).encode("utf8")) > max_bytes:
                return Response(
                    {"message": "Max tran's size is 8MB"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            elif not is_wose_translation_valid(translation):
                return Response(
                    {"message": "Invalid translation"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            normal_max = 0
            premium_max = 1000

            with connection.cursor() as cursor:
                user = request.user
                user_id = user.id

                cursor.execute(
                    create_word_translation(),
                    {
                        "user_id": user_id,
                        "word_id": word_id,
                        "translation": json.dumps(translation),
                        "normal_max": normal_max,
                        "premium_max": premium_max,
                    },
                )
                tran_return = dictfetchall(cursor)[0]

                if not tran_return["is_exist"]:
                    return Response(
                        {"message": "Word does not exist"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                elif not tran_return["is_premium"]:
                    return Response(
                        {"message": "You are not premium user"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                elif not tran_return["is_created"]:
                    return Response(
                        {
                            "message": "You cannot create more than one translation for this word"
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                elif tran_return["is_default"]:
                    return Response(
                        {"message": "Default translation already exists"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                elif tran_return["is_max"]:
                    return Response(
                        {
                            "message": "You have reached the limit for the number of translations you can create"
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                new_translation = tran_return["new_translation"]
                return Response(new_translation, status=status.HTTP_201_CREATED)
        except:
            return Response(
                {"message": "Something went wrong when creating word translation"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_protect, name="dispatch")
class WordTranslationPatchDeleteView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]
    throttle_classes = [
        PatchTranslationRateThrottle,
        DeleteTranslationRateThrottle,
    ]

    def patch(self, request, translation_id):
        try:
            request_data = request.data
            key_list = ("translation",)  # dict

            if not is_request_valid(request_data, key_list):
                return Response(
                    {"message": "Invalid params"}, status=status.HTTP_400_BAD_REQUEST
                )

            translation = request_data["translation"]
            if not is_wose_translation_valid(translation):
                return Response(
                    {"message": "Invalid translation"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            with connection.cursor() as cursor:
                user = request.user
                user_id = user.id

                cursor.execute(
                    update_word_translation(),
                    {
                        "user_id": user_id,
                        "translation_id": translation_id,
                        "translation": json.dumps(translation),
                    },
                )
                tran_return = dictfetchall(cursor)[0]

                if not tran_return["is_exist"]:
                    return Response(
                        {"message": "Word translation does not exist"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                elif not tran_return["is_creator"]:
                    return Response(
                        {"message": "You are not the creator"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                elif tran_return["is_default"]:
                    return Response(
                        {
                            "message": "You cannot update this default translation this way"
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                return Response({}, status=status.HTTP_200_OK)
        except:
            return Response(
                {"message": "Something went wrong when updating word translation"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def delete(self, request, translation_id):
        try:
            with connection.cursor() as cursor:
                user = request.user
                user_id = user.id

                cursor.execute(
                    delete_word_translation(),
                    {
                        "user_id": user_id,
                        "translation_id": translation_id,
                    },
                )
                tran_return = dictfetchall(cursor)[0]

                if not tran_return["is_exist"]:
                    return Response(
                        {"message": "Word translation does not exist"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                elif not tran_return["is_creator"]:
                    return Response(
                        {"message": "You are not the creator"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                elif not tran_return["is_default"]:
                    return Response(
                        {"message": "You cannot delete default translation"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                return Response({}, status=status.HTTP_200_OK)
        except:
            return Response(
                {"message": "Something went wrong when deleting word translation"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_protect, name="dispatch")
class WordTranslationRevisionGetCreateView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [
        GetRevisionRateThrottle,
        PostRevisionRateThrottle,
    ]

    def get(self, request, translation_id):
        try:
            with connection.cursor() as cursor:
                user = request.user
                user_id = user.id

                cursor.execute(
                    get_word_translation_revision(),
                    {
                        "user_id": user_id,
                        "translation_id": translation_id,
                    },
                )
                revision_return = dictfetchall(cursor)[0]

                if not revision_return["is_exist"]:
                    return Response(
                        {"message": "Word translation does not exist"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                elif not revision_return["is_default"]:
                    return Response(
                        {"message": "This is not default translation"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                elif not revision_return["is_moderator"]:
                    return Response(
                        {"message": "You are not the moderator"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                return Response(revision_return["revisions"], status=status.HTTP_200_OK)
        except Exception as e:
            print(f"{type(e)} {e}")
            return Response(
                {
                    "message": "Something went wrong when retrieving word translation revisions"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

    def post(self, request, translation_id):
        try:
            request_data = request.data
            key_list = (
                "translation",
                "request_logs",
            )
            # dict / list

            if not is_request_valid(request_data, key_list):
                return Response(
                    {"message": "Invalid params"}, status=status.HTTP_400_BAD_REQUEST
                )

            translation = request_data["translation"]
            request_logs = request_data["request_logs"]

            if not is_wose_translation_valid(translation):
                return Response(
                    {"message": "Invalid translation"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if not is_request_logs_valid(request_logs):
                return Response(
                    {"message": "Invalid request logs"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            with connection.cursor() as cursor:
                user = request.user
                user_id = user.id

                cursor.execute(
                    create_word_translation_revision(),
                    {
                        "user_id": user_id,
                        "translation_id": translation_id,
                        "translation": json.dumps(translation),
                        "request_array": request_logs,
                    },
                )
                revision_return = dictfetchall(cursor)[0]

                if not revision_return["is_exist"]:
                    return Response(
                        {"message": "Word translation does not exist"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                elif not revision_return["is_default"]:
                    return Response(
                        {"message": "This is not default translation"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                elif not revision_return["is_moderator"]:
                    return Response(
                        {"message": "You are not the moderator"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                return Response(
                    revision_return["new_revision"], status=status.HTTP_200_OK
                )
        except:
            return Response(
                {
                    "message": "Something went wrong when adding revision to word translation"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


@deprecated
class WordTranslationsSearchView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]
    throttle_scope = "search"

    def get(self, request, word_id):
        try:
            page = request.GET.get("page")
            query = request.GET.get("query")
            is_verified = request.GET.get("isverified")

            if (
                is_verified.lower() not in ["true", "false"]
                or (page is None)
                or (not page.isdigit())
            ):
                return Response(
                    {"message": "Invalid params"}, status=status.HTTP_400_BAD_REQUEST
                )

            page = int(page)
            page_size = 12
            offset = (page - 1) * page_size

            with connection.cursor() as cursor:
                user = request.user
                user_id = user.id

                cursor.execute(
                    search_word_translations(),
                    {
                        "user_id": user_id,
                        "limit": page_size,
                        "offset": offset,
                        "word_id": word_id,
                        "value": f"%{query}%",
                        "is_verified": is_verified,
                    },
                )
                tran_return = dictfetchall(cursor)[0]

                translations = tran_return["translations"]
                num_translations = tran_return["num_translations"]
                num_pages = math.ceil(num_translations / page_size)

                return Response(
                    {
                        "current_page": page,
                        "page_size": page_size,
                        "translations": translations,
                        "num_pages": num_pages,
                        "num_translations": num_translations,
                    },
                    status=status.HTTP_200_OK,
                )
        except Exception as e:
            print(f"{type(e)} {e}")
            return Response(
                {"message": "Something went wrong when searching word translations"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@deprecated
class WordTranslationUseView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]
    throttle_scope = "limit_post"

    def post(self, request, translation_id):
        try:
            normal_max = 0
            premium_max = 1000

            with connection.cursor() as cursor:
                user = request.user
                user_id = user.id

                cursor.execute(
                    add_word_translation_using(),
                    {
                        "translation_id": translation_id,
                        "user_id": user_id,
                        "normal_max": normal_max,
                        "premium_max": premium_max,
                    },
                )
                tran_return = dictfetchall(cursor)[0]

                if not tran_return["is_exist"]:
                    return Response(
                        {"message": "Word translation does not exist"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                elif tran_return["is_creator"]:
                    return Response(
                        {
                            "message": "You cannot use the translation when you already are creator"
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                elif tran_return["is_using"]:
                    return Response(
                        {"message": "Already using word translation"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                elif not tran_return["is_premium"]:
                    return Response(
                        {"message": "You are not premium user"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                elif tran_return["is_max"]:
                    return Response(
                        {
                            "message": "You have reached the limit for the number of translations you can use"
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                return Response({}, status=status.HTTP_200_OK)
        except:
            return Response(
                {"message": "Something went wrong when using word translation"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@deprecated
class WordTranslationRemoveView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]
    throttle_scope = "limit_delete"

    def delete(self, request, translation_id):
        try:
            with connection.cursor() as cursor:
                user = request.user
                user_id = user.id

                cursor.execute(
                    remove_word_translation_using(),
                    {
                        "translation_id": translation_id,
                        "user_id": user_id,
                    },
                )
                tran_return = dictfetchall(cursor)[0]

                if not tran_return["is_using"]:
                    return Response(
                        {"message": "You are not using this word translation"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                return Response({}, status=status.HTTP_200_OK)
        except:
            return Response(
                {"message": "Something went wrong when removing word translation"},
                status=status.HTTP_400_BAD_REQUEST,
            )
