import re
from django.contrib import auth
from django.db import connection
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from base.api.queries.fetch import *
from base.api.queries.user import *
from base.api.views.validation import *
from base.decorators import deprecated


@deprecated()
class AuthenticatedCheckView(APIView):
    permission_classes = [
        AllowAny,
    ]
    throttle_scope = "limit_get"

    def get(self, request):
        try:
            is_authenticated = True if request.user.is_authenticated else False
            if is_authenticated:
                return Response({}, status=status.HTTP_200_OK)

            return Response({}, status=status.HTTP_403_FORBIDDEN)
        except Exception as e:
            print(f"{type(e)} {e}")
            return Response(
                {"message": "Something went wrong when checking authentication status"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(ensure_csrf_cookie, name="dispatch")
class GetCSRFToken(APIView):
    permission_classes = [
        AllowAny,
    ]
    throttle_scope = "limit_get"

    def get(self, request, format=None):
        return Response(
            {"message": "Successfully! CSRF cookie set"}, status=status.HTTP_200_OK
        )


# @method_decorator(csrf_protect, name="dispatch")
class LoginView(APIView):
    permission_classes = [
        AllowAny,
    ]
    throttle_scope = "limit_post"

    def post(self, request):
        try:
            request_data = request.data
            key_list = ("username", "password")

            if not is_request_valid(request_data, key_list):
                return Response(
                    {"message": "Username or Password is incorrect"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            username = request_data["username"]
            password = request_data["password"]

            if (not isinstance(username, str)) or (not isinstance(password, str)):
                return Response(
                    {"message": "Username or Password is incorrect"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            elif (not re.fullmatch(username_regex, username)) or (len(username) > 69):
                return Response(
                    {"message": "Username or Password is incorrect"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            elif (
                (not re.fullmatch(password_regex, password))
                or (len(password) < 8)
                or (len(password) > 72)
            ):
                return Response(
                    {"message": "Username or Password is incorrect"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            user = auth.authenticate(username=username, password=password)

            if user is not None:
                # if user is moderator or enable 2fa then
                #   - send an verify email
                #   return Response({}, status=status.HTTP_100_CONTINUE)
                # else:
                #   auth.login(request, user)
                # create LoginVerifyView ("username", "password", "verification_code")

                auth.login(request, user)

                with connection.cursor() as cursor:
                    user_id = user.id
                    cursor.execute(get_meow(), {"user_id": user_id})
                    meow = dictfetchall(cursor)[0]
                    return Response(meow, status=status.HTTP_200_OK)

            return Response(
                {"message": "Username or Password is incorrect"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            print(f"{type(e)} {e}")
            return Response(
                {"message": "Something went wrong when logging in"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_protect, name="dispatch")
class LogoutView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]
    throttle_scope = "limit_post"

    def post(self, request, format=None):
        try:
            auth.logout(request)
            return Response({}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"{type(e)} {e}")
            return Response(
                {"message": "Something went wrong when logging out"},
                status=status.HTTP_400_BAD_REQUEST,
            )
