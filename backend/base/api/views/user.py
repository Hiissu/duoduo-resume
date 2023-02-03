import json
import re

from django.conf import settings
from django.contrib.auth.hashers import check_password, make_password
from django.db import connection, transaction
from django.template.loader import render_to_string
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from base.api.queries.fetch import *
from base.api.queries.profile import *
from base.api.queries.user import *
from base.api.queries.verification import *
from base.api.views.validation import *
from base.api.views.verification import *
from base.api.views.throttling import *
from base.models import *


@method_decorator(csrf_protect, name="dispatch")
class MeowGetView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]
    throttle_classes = [
        GetMeowRateThrottle,
        PatchMeowRateThrottle,
    ]

    def get(self, request):
        try:
            with connection.cursor() as cursor:
                user = request.user
                user_id = user.id

                cursor.execute(
                    get_meow(),
                    {
                        "user_id": user_id,
                    },
                )
                meow = dictfetchall(cursor)[0]

                if meow["uid"] is None:
                    return Response(
                        {"message": "User does not exist"},
                        status=status.HTTP_403_FORBIDDEN,
                    )

                return Response(meow, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"{type(e)} {e}")
            return Response(
                {"message": "Something went wrong when retrieving meow"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def patch(self, request):
        try:
            request_data = request.data
            key_list = ("password", "new_password")

            if not is_request_valid(request_data, key_list):
                return Response(
                    {"message": "Invalid params"}, status=status.HTTP_400_BAD_REQUEST
                )

            password = request_data["password"]
            new_password = request_data["new_password"]

            if (not isinstance(password, str)) or (not isinstance(new_password, str)):
                return Response(
                    {"message": "Invalid params"}, status=status.HTTP_400_BAD_REQUEST
                )
            elif (
                (not re.fullmatch(password_regex, password))
                or (len(password) < 8)
                or (len(password) > 72)
                or (not re.fullmatch(password_regex, new_password))
                or (len(new_password) < 8)
                or (len(new_password) > 72)
            ):
                return Response(
                    {"message": "Invalid password"}, status=status.HTTP_400_BAD_REQUEST
                )

            user = request.user
            user_id = user.id
            user_username = user.username

            if not user.check_password(password):
                return Response(
                    {"message": "Password does not match"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            with connection.cursor() as cursor:
                hashed_password = make_password(new_password)
                cursor.execute(
                    update_password_user(),
                    {
                        "user_id": user_id,
                        "password": hashed_password,
                    },
                )
                user_return = dictfetchall(cursor)[0]

                if user_return["is_verified"]:
                    email = user_return["email"]

                    front_end_url = settings.CORS_ALLOWED_ORIGINS[0]
                    subject = "DuoDuo Password Changed"
                    message = render_to_string(
                        "base/emails/password_changed.html",
                        {
                            "email": email,
                            "user_username": user_username,
                            "front_end_url": front_end_url,
                            "discord_url": settings.DISCORD_URL,
                        },
                    )
                    email_from = settings.EMAIL_HOST_USER
                    recipient_list = [email]
                    SendMailThread(subject, message, email_from, recipient_list).start()

                return Response(
                    {"message": "Password has been updated"},
                    status=status.HTTP_200_OK,
                )
        except Exception as e:
            print(f"{type(e)} {e}")
            return Response(
                {"message": "Something went wrong when updating password"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class RegisterView(APIView):
    permission_classes = [
        AllowAny,
    ]
    throttle_scope = "limit_post"

    def post(self, request):
        try:
            request_data = request.data
            key_list = ("courseid", "username", "email", "password")
            # int / str / str / str

            if not is_request_valid(request_data, key_list):
                return Response(
                    {"message": "Invalid params"}, status=status.HTTP_400_BAD_REQUEST
                )

            course_id = request_data["courseid"]
            username = request_data["username"]
            email = request_data["email"]
            password = request_data["password"]

            if (
                (not isinstance(course_id, int))
                or (not isinstance(username, str))
                or (not isinstance(email, str))
                or (not isinstance(password, str))
            ):
                return Response(
                    {"message": "Invalid params"}, status=status.HTTP_400_BAD_REQUEST
                )
            elif (not re.fullmatch(username_regex, username)) or (len(username) > 69):
                return Response(
                    {"message": "Invalid username"}, status=status.HTTP_400_BAD_REQUEST
                )
            elif (not re.fullmatch(email_regex, email)) or (len(email) > 220):
                return Response(
                    {"message": "Invalid email address"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            elif (
                (not re.fullmatch(password_regex, password))
                or (len(password) < 8)
                or (len(password) > 72)
            ):
                return Response(
                    {"message": "Invalid password"}, status=status.HTTP_400_BAD_REQUEST
                )

            with connection.cursor() as cursor:
                with transaction.atomic():
                    verification_code = random_int()
                    hashed_password = make_password(password)
                    time_expire = 60  # minutes

                    cursor.execute(
                        create_user(),
                        {
                            "username": username,
                            "password": hashed_password,
                            "email": email,
                            "course_id": course_id,
                            "courses_learning_ids": json.dumps([course_id]),
                            "verification_code": verification_code,
                            "type_verification": type_verification["email_verify"],
                            "time_expire": time_expire,
                        },
                    )
                    user_return = dictfetchall(cursor)[0]

                    if user_return["is_username_exist"]:
                        return Response(
                            {"message": "Username already exists"},
                            status=status.HTTP_400_BAD_REQUEST,
                        )

                    elif user_return["is_email_exist"]:
                        return Response(
                            {"message": "Email is already registered"},
                            status=status.HTTP_400_BAD_REQUEST,
                        )

                    elif not user_return["is_course_exist"]:
                        return Response(
                            {"message": "Course does not exist"},
                            status=status.HTTP_400_BAD_REQUEST,
                        )

                    # ~ send Verification code
                    front_end_url = settings.CORS_ALLOWED_ORIGINS[0]
                    subject = "Verify Email Address for DuoDuo"
                    message = render_to_string(
                        "base/emails/email_verify.html",
                        {
                            "username": username,
                            "verification_code": verification_code,
                            "front_end_url": front_end_url,
                        },
                    )
                    email_from = settings.EMAIL_HOST_USER
                    recipient_list = [email]

                    SendMailThread(subject, message, email_from, recipient_list).start()

                    return Response(
                        {
                            "message": f"Your account has been created with username: {username} and email: {email}"
                        },
                        status=status.HTTP_201_CREATED,
                    )
        except Exception as e:
            print(f"{type(e)} {e}")
            return Response(
                {"message": "Something went wrong when registering account"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_protect, name="dispatch")
class UsernameExistView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]
    throttle_scope = "limit_post"

    def post(self, request):
        try:
            request_data = request.data
            key_list = ("username",)

            if not is_request_valid(request_data, key_list):
                return Response(
                    {"message": "Invalid params"}, status=status.HTTP_400_BAD_REQUEST
                )

            username = request_data["username"]

            if not isinstance(username, str):
                return Response(
                    {"message": "Invalid params"}, status=status.HTTP_400_BAD_REQUEST
                )
            elif (not re.fullmatch(username_regex, username)) or (len(username) > 69):
                return Response(
                    {"message": "Invalid username"}, status=status.HTTP_400_BAD_REQUEST
                )

            with connection.cursor() as cursor:
                with transaction.atomic():
                    cursor.execute(
                        is_username_exist(),
                        {
                            "user_username": username,
                        },
                    )
                    user_return = dictfetchall(cursor)[0]
                    is_exist = user_return["is_exist"]
                    return Response({"is_exist": is_exist}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"{type(e)} {e}")
            return Response(
                {"message": "Something went wrong when checking username"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_protect, name="dispatch")
class UsernameChangeView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]
    throttle_scope = "limit_update"

    def put(self, request):
        try:
            request_data = request.data
            key_list = ("username", "password")

            if not is_request_valid(request_data, key_list):
                return Response(
                    {"message": "Invalid params"}, status=status.HTTP_400_BAD_REQUEST
                )

            username = request_data["username"]
            password = request_data["password"]

            if (not isinstance(username, str)) or (not isinstance(password, str)):
                return Response(
                    {"message": "Invalid params"}, status=status.HTTP_400_BAD_REQUEST
                )
            elif (not re.fullmatch(username_regex, username)) or (len(username) > 69):
                return Response(
                    {"message": "Invalid username"}, status=status.HTTP_400_BAD_REQUEST
                )

            with connection.cursor() as cursor:
                with transaction.atomic():
                    user = request.user
                    user_id = user.id

                    if not user.check_password(password):
                        return Response(
                            {"message": "Password does not match"},
                            status=status.HTTP_400_BAD_REQUEST,
                        )

                    cursor.execute(
                        change_username_user(),
                        {
                            "user_id": user_id,
                            "user_username": username,
                        },
                    )
                    user_return = dictfetchall(cursor)[0]

                    if user_return["is_exist"]:
                        return Response(
                            {"message": "Username already exists"},
                            status=status.HTTP_400_BAD_REQUEST,
                        )

                    return Response(
                        {"message": "Username has been updated"},
                        status=status.HTTP_200_OK,
                    )
        except Exception as e:
            print(f"{type(e)} {e}")
            return Response(
                {"message": "Something went wrong when changing username"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_protect, name="dispatch")
class PasswordPatchView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]
    throttle_scope = "limit_patch"
