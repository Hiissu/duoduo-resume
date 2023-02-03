import base64
import re
import uuid

# from io import BytesIO, StringIO
from pathlib import Path

from django.conf import settings
from django.core.files.base import ContentFile
from django.db import connection, reset_queries, transaction
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from base.api.queries.fetch import dictfetchall
from base.api.queries.profile import *
from base.api.views.authentication import *


@method_decorator(csrf_protect, name="dispatch")
class ProfileGetView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]
    throttle_scope = "get"

    def get(self, request, username):
        try:
            if not re.fullmatch(username_regex, username):
                return Response(
                    {"message": "Invalid username"}, status=status.HTTP_400_BAD_REQUEST
                )

            with connection.cursor() as cursor:
                cursor.execute(
                    is_profile_exist(),
                    {
                        "username": username,
                    },
                )
                user_profile = dictfetchall(cursor)[0]

                if user_profile["is_exist"]:
                    return Response({**user_profile}, status=status.HTTP_200_OK)
                return Response(
                    {"message": "User is not exist"}, status=status.HTTP_404_NOT_FOUND
                )
        except Exception as e:
            print(f"{type(e)} {e}")
            return Response(
                {"message": "Something went wrong when retrieving profile"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_protect, name="dispatch")
class ProfilePatchView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]
    throttle_scope = "limit_patch"

    def patch(self, request):
        try:
            request_data = request.data
            key_list = (
                "avatar",
                "name",
                "bio",
            )
            # str / str / str /

            if not is_request_valid(request_data, key_list):
                return Response(
                    {"message": "Invalid params"}, status=status.HTTP_400_BAD_REQUEST
                )

            avatar = request_data["avatar"]
            name = request_data["name"]
            bio = request_data["bio"]

            if (
                (not isinstance(avatar, str))
                or (not isinstance(name, str))
                or (not isinstance(bio, str))
                or (len(name) > 220)
                or (len(bio) > 220)
                or ((len(avatar) > 0) and (not avatar.startswith("data:image/")))
            ):
                return Response(
                    {"message": "Invalid params"}, status=status.HTTP_400_BAD_REQUEST
                )

            user = request.user
            user_id = user.id

            is_avatar = len(avatar) > 0
            if is_avatar:
                try:
                    # format ~ data:image/'extension',
                    format, image_base64 = avatar.split(";base64,")
                    extension = format.split("/")[-1]

                    image_content = ContentFile(
                        base64.b64decode(image_base64), name=f"unknown.{extension}"
                    )

                    max_width = 720
                    max_height = 720
                    image = Image.open(image_content)
                    if image.height > max_width or image.width > max_height:
                        output_size = (max_width, max_height)
                        image.thumbnail(output_size)

                    folder = f"avatars/{user_id}"
                    folder_path = settings.MEDIA_ROOT / folder
                    Path(folder_path).mkdir(parents=True, exist_ok=True)

                    path = f"{folder}/{uuid.uuid1().hex}.webp"
                    file_path = settings.MEDIA_ROOT / path

                    image.save(file_path, format="webp")
                except Exception as e:
                    return Response(
                        {
                            "message": "Something went wrong when converting base64 to image"
                        },
                        status=status.HTTP_400_BAD_REQUEST,
                    )

            with connection.cursor() as cursor:
                cursor.execute(
                    update_profile(is_avatar),
                    {
                        "user_id": user_id,
                        "name": name,
                        "bio": bio,
                        "avatar": path if is_avatar else "",
                    },
                )
                return Response(
                    {"message": "Profile has been updated"}, status=status.HTTP_200_OK
                )
        except Exception as e:
            print(f"{type(e)} {e}")
            return Response(
                {"message": "Something went wrong when updating profile"},
                status=status.HTTP_400_BAD_REQUEST,
            )
