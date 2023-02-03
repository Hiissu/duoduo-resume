import json
import math

from django.conf import settings
from django.db import connection, reset_queries, transaction
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from base.api.queries.authentication import *
from base.api.queries.collection import *
from base.api.queries.fetch import *
from base.api.queries.phrase import *
from base.api.queries.phrase_translation import *
from base.api.queries.profile import *
from base.api.queries.sentence import *
from base.api.queries.sentence_translation import *
from base.api.queries.topic import *
from base.api.queries.unit import *
from base.api.queries.word import *
from base.api.queries.word_translation import *
from base.api.views.encryption import *
from base.api.views.validation import *
from base.api.views.throttling import *
from base.models import *


@method_decorator(csrf_protect, name="dispatch")
class CollectionsGetCreateView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]
    throttle_classes = [
        GetCollectionsRateThrottle,
        PostCollectionsRateThrottle,
    ]

    def get(self, request):
        try:
            page = request.GET.get("page")
            if (page is None) or (not page.isdigit()):
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
                    get_collections(),
                    {"user_id": user_id, "limit": page_size, "offset": offset},
                )
                collection_return = dictfetchall(cursor)[0]

                collections = collection_return["collections"]
                num_collections = collection_return["num_collections"]
                num_pages = math.ceil(num_collections / page_size)

                return Response(
                    {
                        "current_page": page,
                        "page_size": page_size,
                        "collections": collections,
                        "num_pages": num_pages,
                        "num_collections": num_collections,
                    },
                    status=status.HTTP_200_OK,
                )
        except Exception as e:
            print(f"{type(e)} {e}")
            return Response(
                {"message": "Something went wrong when retrieving collections"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def post(self, request):
        try:
            request_data = request.data
            key_list = ("name", "banner_url", "description", "topics")
            #  str / str / str / str list

            if not is_request_valid(request_data, key_list):
                return Response(
                    {"message": "Invalid params"}, status=status.HTTP_400_BAD_REQUEST
                )

            name = request_data["name"]
            banner_url = request_data["banner_url"]
            description = request_data["description"]
            topics = request_data["topics"]

            if (
                (not isinstance(name, str))
                or (not isinstance(banner_url, str))
                or (not isinstance(description, str))
                or (not isinstance(topics, list))
                or (not (0 < len(name.strip()) <= 220))
                or (len(banner_url) > 2020)
                or (len(description) > 220)
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
                user = request.user
                user_id = user.id

                cursor.execute(
                    create_collection(),
                    {
                        "user_id": user_id,
                        "name": name,
                        "banner_url": banner_url,
                        "description": description,
                        "topics": json.dumps(topics),
                        "normal_max": normal_max,
                        "premium_max": premium_max,
                    },
                )
                collection_return = dictfetchall(cursor)[0]

                if collection_return["is_max"]:
                    return Response(
                        {
                            "message": "You have reached the limit for the number of collections you can create"
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                new_collection = collection_return["new_collection"]
                return Response(new_collection, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f"{type(e)} {e}")
            return Response(
                {"message": "Something went wrong when creating new collection"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_protect, name="dispatch")
class CollectionsSearchView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]
    throttle_scope = "search"

    def get(self, request):
        try:
            page = request.GET.get("page")
            query = request.GET.get("query")
            option = request.GET.get("option")
            topic_ids = request.GET.getlist("topicid")

            # any(not id.isdigit() for id in topic_ids)
            topic_ids = [int(id) for id in topic_ids if id.isdigit()]

            options_list = ["collection", "creator"]
            if (
                ((page is None) or (not page.isdigit()) or (int(page) < 1))
                or (option is None)
                or (option not in options_list)
                or (len(topic_ids) > 20)
                or (query is None and len(topic_ids) == 0)
                or (len(query) == 0 and len(topic_ids) == 0)
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
                    search_collections(),
                    {
                        "user_id": user_id,
                        "limit": page_size,
                        "offset": offset,
                        "option": option,
                        "value": f"%{query}%",
                        "topic_ids": json.dumps(topic_ids),
                    },
                )
                collection_return = dictfetchall(cursor)[0]

                collections = collection_return["collections"]
                num_collections = collection_return["num_collections"]
                num_pages = math.ceil(num_collections / page_size)

                return Response(
                    {
                        "current_page": page,
                        "page_size": page_size,
                        "collections": collections,
                        "num_pages": num_pages,
                        "num_collections": num_collections,
                    },
                    status=status.HTTP_200_OK,
                )
        except Exception as e:
            print(f"{type(e)} {e}")
            return Response(
                {"message": "Something went wrong when searching collections"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_protect, name="dispatch")
class CollectionsLearningGetView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]
    throttle_scope = "limit_get"

    def get(self, request):
        try:
            with connection.cursor() as cursor:
                user = request.user
                user_id = user.id
                cursor.execute(get_collections_learning(), {"user_id": user_id})
                collection_return = dictfetchall(cursor)[0]
                collections_learning = collection_return["collection_learning"]

            return Response(collections_learning, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"{type(e)} {e}")
            return Response(
                {
                    "message": "Something went wrong when retrieving collections learning"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


# pending for future
@method_decorator(csrf_protect, name="dispatch")
class CollectionsLearningSearchView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]
    throttle_scope = "search"

    def get(self, request):
        try:
            page = request.GET.get("page")
            query = request.GET.get("query")
            option = request.GET.get("option")
            topic_ids = request.GET.getlist("topicid")

            # any(not id.isdigit() for id in topic_ids)
            topic_ids = [int(id) for id in topic_ids if id.isdigit()]

            options_list = ["collection", "creator"]
            if (
                (page is None)
                or (not page.isdigit())
                or int(page) < 1
                or (option is None)
                or (option not in options_list)
                or (len(topic_ids) > 20)
                or ((query is None) and (len(topic_ids) == 0))
                or ((len(query) == 0) and (len(topic_ids) == 0))
            ):
                return Response(
                    {"message": "Invalid params"}, status=status.HTTP_400_BAD_REQUEST
                )

            is_query = len(query) > 0
            is_topic = len(topic_ids) > 0
            is_collectioname = option == options_list[0]
            is_count = True

            page = int(page)
            page_size = 12
            offset = (page - 1) * page_size

            with connection.cursor() as cursor:
                user = request.user
                user_id = user.id

                cursor.execute(
                    search_collections_learning(
                        is_count, is_collectioname, is_query, is_topic
                    ),
                    {
                        "query": f"%{query}%",
                        "topic_ids": topic_ids,
                    },
                )
                num_collections = dictfetchall(cursor)[0]["num_collections"]

                if offset > num_collections:
                    return Response(
                        {"message": "Invalid page"}, status=status.HTTP_400_BAD_REQUEST
                    )
                num_pages = math.ceil(num_collections / page_size)

                cursor.execute(
                    search_collections_learning(
                        not is_count, is_collectioname, is_query, is_topic
                    ),
                    {
                        "user_id": user_id,
                        "query": f"%{query}%",
                        "topic_ids": tuple(topic_ids),
                        "limit": page_size,
                        "offset": offset,
                    },
                )
                collections_learning = dictfetchall(cursor)

                return Response(
                    {
                        "current_page": page,
                        "num_collections": num_collections,
                        "page_size": page_size,
                        "num_pages": num_pages,
                        "collections": collections_learning,
                    },
                    status=status.HTTP_200_OK,
                )
        except Exception as e:
            print(f"{type(e)} {e}")
            return Response(
                {"message": "Something went wrong when searching collections"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_protect, name="dispatch")
class CollectionGetDeleteView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]
    throttle_classes = [
        GetCollectionRateThrottle,
        DeleteCollectionRateThrottle,
    ]

    def get(self, request, collection_id):
        try:
            with connection.cursor() as cursor:
                user = request.user
                user_id = user.id

                cursor.execute(
                    get_detail_collection(),
                    {
                        "user_id": user_id,
                        "collection_id": collection_id,
                    },
                )
                collection_return = dictfetchall(cursor)[0]

                if collection_return["id"] is None:
                    return Response(
                        {"message": "Collection does not exist"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                return Response(collection_return, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"{type(e)} {e}")
            return Response(
                {"message": "Something went wrong when retrieving collection detail"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def delete(self, request, collection_id):
        try:
            with connection.cursor() as cursor:
                with transaction.atomic():
                    user = request.user
                    user_id = user.id

                    cursor.execute(
                        delete_collection(),
                        {
                            "collection_id": collection_id,
                            "user_id": user_id,
                        },
                    )
                    collection_return = dictfetchall(cursor)[0]

                    if not collection_return["is_exist"]:
                        return Response(
                            {"message": "Collection does not exist"},
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                    elif not collection_return["is_creator"]:
                        return Response(
                            {"message": "You are not the creator"},
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                    return Response({}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"{type(e)} {e}")
            return Response(
                {"message": "Something went wrong when deleting collection"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_protect, name="dispatch")
class CollectionLearningView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]
    throttle_classes = [
        PostCollectionLearningRateThrottle,
        DeleteCollectionLearningRateThrottle,
    ]

    def post(self, request, collection_id):
        try:
            normal_max = 20
            premium_max = 1000

            with connection.cursor() as cursor:
                with transaction.atomic():
                    user = request.user
                    user_id = user.id

                    cursor.execute(
                        add_collection_learning(),
                        {
                            "collection_id": collection_id,
                            "user_id": user_id,
                            "normal_max": normal_max,
                            "premium_max": premium_max,
                        },
                    )
                    collection_return = dictfetchall(cursor)[0]

                    if not collection_return["is_exist"]:
                        return Response(
                            {"message": "collection does not exist"},
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                    elif collection_return["is_learning"]:
                        return Response(
                            {"message": "Already learning collection"},
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                    elif collection_return["is_max"]:
                        return Response(
                            {
                                "message": "You have reached the limit for the number of collections you can learn"
                            },
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                    return Response(
                        {
                            "message": "Added to collections learning",
                        },
                        status=status.HTTP_200_OK,
                    )
        except Exception as e:
            print(f"{type(e)} {e}")
            return Response(
                {"message": "Something went wrong when learning collection"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def delete(self, request, collection_id):
        try:
            with connection.cursor() as cursor:
                with transaction.atomic():
                    user = request.user
                    user_id = user.id

                    cursor.execute(
                        remove_collection_learning(),
                        {
                            "collection_id": collection_id,
                            "user_id": user_id,
                        },
                    )
                    collection_return = dictfetchall(cursor)[0]

                    if not collection_return["is_exist"]:
                        return Response(
                            {"message": "Collection does not exist"},
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                    elif not collection_return["is_learning"]:
                        return Response(
                            {"message": "You are not learning this collection"},
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                    return Response(
                        {
                            "message": "Removed from collections learning",
                        },
                        status=status.HTTP_200_OK,
                    )
        except Exception as e:
            print(f"{type(e)} {e}")
            return Response(
                {"message": "Something went wrong when removing collection"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_protect, name="dispatch")
class CollectionPatchOverviewView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]
    throttle_scope = "limit_patch"

    def patch(self, request, collection_id):
        try:
            request_data = request.data
            key_list = ("name", "description", "banner_url", "topics")
            # str / str / str / str list

            if not is_request_valid(request_data, key_list):
                return Response(
                    {"message": "Invalid params"}, status=status.HTTP_400_BAD_REQUEST
                )

            name = request_data["name"]
            description = request_data["description"]
            banner_url = request_data["banner_url"]
            topics = request_data["topics"]

            if (
                (not isinstance(name, str))
                or (not isinstance(banner_url, str))
                or (not isinstance(description, str))
                or (not isinstance(topics, list))
                or (not (0 < len(name.strip()) <= 220))
                or (len(description) > 220)
                or (len(banner_url) > 2020)
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

            with connection.cursor() as cursor:
                user = request.user
                user_id = user.id

                cursor.execute(
                    update_overview_collection(),
                    {
                        "user_id": user_id,
                        "collection_id": collection_id,
                        "name": name,
                        "description": description,
                        "banner_url": banner_url,
                        "topics": json.dumps(topics),
                    },
                )
                collection_return = dictfetchall(cursor)[0]

                if not collection_return["is_exist"]:
                    return Response(
                        {"message": "collection does not exist"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                elif not collection_return["is_creator"]:
                    return Response(
                        {"message": "You are not the creator"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                return Response({}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"{type(e)} {e}")
            return Response(
                {"message": "Something went wrong when updating collection overview"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_protect, name="dispatch")
class CollectionPatchDocumentsView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]
    throttle_scope = "limit_patch"

    def patch(self, request, collection_id):
        try:
            request_data = request.data
            key_list = ("documents",)
            # list

            if not is_request_valid(request_data, key_list):
                return Response(
                    {"message": "Invalid params"}, status=status.HTTP_400_BAD_REQUEST
                )

            documents = request_data["documents"]

            if not isinstance(documents, list):
                return Response(
                    {"message": "Invalid params"}, status=status.HTTP_400_BAD_REQUEST
                )

            max_bytes = 8388608
            documents = json.dumps(documents)
            if len(documents.encode("utf8")) > max_bytes:
                return Response(
                    {"message": "Your documents are too powerful. The max size is 8MB"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            print("Doc byte length", len(documents.encode("utf8")))

            with connection.cursor() as cursor:
                user = request.user
                user_id = user.id

                cursor.execute(
                    update_documents_collection(),
                    {
                        "user_id": user_id,
                        "collection_id": collection_id,
                        "documents": json.dumps(documents),
                    },
                )
                collection_return = dictfetchall(cursor)[0]

                if not collection_return["is_exist"]:
                    return Response(
                        {"message": "collection does not exist"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                elif not collection_return["is_creator"]:
                    return Response(
                        {"message": "You are not the creator"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                return Response({}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"{type(e)} {e}")
            return Response(
                {
                    "message": "Something went wrong when updating documents in collection"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
