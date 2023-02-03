import json
import re
import threading
import urllib.parse

from django.conf import settings
from django.contrib.auth.hashers import check_password, make_password
from django.core.mail import EmailMessage, EmailMultiAlternatives, send_mail
from django.db import connection, transaction
from django.template.loader import render_to_string
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from base.api.queries.course import *
from base.api.queries.fetch import *
from base.api.queries.profile import *
from base.api.queries.user import *
from base.api.queries.verification import *
from base.api.views.encryption import RSAEncryption
from base.api.views.user import *
from base.api.views.validation import *
from base.models import *


class SendMailThread(threading.Thread):
    def __init__(self, subject, message, email_from, recipient_list):
        self.subject = subject
        self.message = message
        self.email_from = email_from
        self.recipient_list = recipient_list
        threading.Thread.__init__(self)

    def run(self):
        """
        mail = EmailMessage(self.subject, self.message, self.email_from, self.recipient_list)
        mail.content_subtype = "html"
        mail.send(fail_silently=False)

        mail = EmailMultiAlternatives(self.subject, self.message, self.email_from, self.recipient_list)
        mail.attach_alternative(self.message, "text/html")
        mail.send(fail_silently=False)
        """

        send_mail(
            self.subject,
            self.message,
            self.email_from,
            self.recipient_list,
            fail_silently=False,
            html_message=self.message,
        )


type_verification = {
    "email_verify": 0,
    "password_reset": 1,
    "login_verify": 2,
}


@method_decorator(csrf_protect, name="dispatch")
class EmailVerifyView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]
    throttle_scope = "verify"

    def post(self, request):
        try:
            request_data = request.data
            key_list = ("email",)

            if not is_request_valid(request_data, key_list):
                return Response(
                    {"message": "Invalid params"}, status=status.HTTP_400_BAD_REQUEST
                )

            email = request_data["email"]

            if (
                (not isinstance(email, str))
                or (len(email) > 220)
                or (not re.fullmatch(email_regex, email))
            ):
                return Response(
                    {"message": "Invalid email address"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            with connection.cursor() as cursor:
                with transaction.atomic():
                    user = request.user
                    user_id = user.id
                    user_username = user.username

                    time_expire = 60  # minutes
                    verification_code = random_int()
                    cursor.execute(
                        send_email_verification(),
                        {
                            "user_id": user_id,
                            "email": email,
                            "verification_code": verification_code,
                            "type_verification": type_verification["email_verify"],
                            "time_expire": time_expire,
                        },
                    )
                    verif_return = dictfetchall(cursor)[0]

                    if verif_return["is_exist"]:
                        return Response(
                            {"message": "Email is already registered"},
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                    elif verif_return["is_verified"]:
                        return Response(
                            {"message": "Your email is already verified"},
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                    elif verif_return["is_verifying"]:
                        return Response(
                            {
                                "message": f"We have sent you a verification email to {email}, please check both your inbox and spam folder."
                            },
                            status=status.HTTP_200_OK,
                        )

                    front_end_url = settings.CORS_ALLOWED_ORIGINS[0]
                    subject = "Verify Email Address for DuoDuo"
                    message = render_to_string(
                        "base/emails/email_verify.html",
                        {
                            "user_username": user_username,
                            "verification_code": verification_code,
                            "front_end_url": front_end_url,
                        },
                    )
                    email_from = settings.EMAIL_HOST_USER
                    recipient_list = [email]

                    SendMailThread(subject, message, email_from, recipient_list).start()

                    return Response(
                        {
                            "message": f"Check your email: {email} to get the verification code"
                        },
                        status=status.HTTP_200_OK,
                    )
        except Exception as e:
            print(f"{type(e)} {e}")
            return Response(
                {"message": "Something went wrong when reverifying email"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_protect, name="dispatch")
class EmailConfirmVerifyView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]
    throttle_scope = "confirm"

    def post(self, request):
        try:
            request_data = request.data
            key_list = ("email", "verification_code")

            if not is_request_valid(request_data, key_list):
                return Response(
                    {"message": "Invalid params"}, status=status.HTTP_400_BAD_REQUEST
                )

            email = request_data["email"]
            verification_code = request_data["verification_code"]

            if (
                (not isinstance(email, str))
                or (len(email) > 220)
                or (not re.fullmatch(email_regex, email))
                or (not isinstance(verification_code, str))
            ):
                return Response(
                    {"message": "Invalid params"}, status=status.HTTP_400_BAD_REQUEST
                )

            with connection.cursor() as cursor:
                with transaction.atomic():
                    user = request.user
                    user_id = user.id

                    time_expire = 60  # minutes
                    cursor.execute(
                        confirm_email_verification(),
                        {
                            "user_id": user_id,
                            "email": email,
                            "verification_code": verification_code,
                            "type_verification": type_verification["email_verify"],
                            "time_expire": time_expire,
                        },
                    )
                    verif_return = dictfetchall(cursor)[0]

                    if not verif_return["is_exist"] or verif_return["is_expired"]:
                        return Response(
                            {"message": "Verification code has been expired"},
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                    elif verif_return["is_exceeded"]:
                        return Response(
                            {"message": "You have exceeded the rate limit"},
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                    elif verif_return["is_invalid"]:
                        return Response(
                            {"message": "Invalid verification code"},
                            status=status.HTTP_400_BAD_REQUEST,
                        )

                    return Response(
                        {"message": "Your email has been verified"},
                        status=status.HTTP_200_OK,
                    )
        except Exception as e:
            print(f"{type(e)} {e}")
            return Response(
                {"message": "Something went wrong when verifying email"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_protect, name="dispatch")
class EmailChangeView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]
    throttle_scope = "verify"

    def post(self, request):
        try:
            with connection.cursor() as cursor:
                with transaction.atomic():
                    user = request.user
                    user_id = user.id

                    time_expire = 60  # minutes
                    verification_code = random_int_char()

                    cursor.execute(
                        request_change_email(),
                        {
                            "user_id": user_id,
                            "email": email,
                            "verification_code": verification_code,
                            "type_verification": type_verification["email_verify"],
                            "time_expire": time_expire,
                        },
                    )
                    verif_return = dictfetchall(cursor)[0]
                    email = verif_return["email"]

                    if not verif_return["is_verified"]:
                        return Response(
                            {"message": "Invalid action"},
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                    elif verif_return["is_verifying"]:
                        return Response(
                            {
                                "message": f"We have sent you a verification email to {email}, please check both your inbox and spam folder."
                            },
                            status=status.HTTP_400_BAD_REQUEST,
                        )

                    subject = (
                        f"Your DuoDuo email verification code is {verification_code}"
                    )
                    message = render_to_string(
                        "base/emails/email_change.html",
                        {
                            "verification_code": verification_code,
                        },
                    )
                    email_from = settings.EMAIL_HOST_USER
                    recipient_list = [email]

                    SendMailThread(subject, message, email_from, recipient_list).start()

                    return Response(
                        {"message": "Check your email to get the verification code"},
                        status=status.HTTP_200_OK,
                    )
        except Exception as e:
            print(f"{type(e)} {e}")
            return Response(
                {"message": "Something went wrong when changing email"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def put(self, request):
        try:
            request_data = request.data
            key_list = ("email", "password")

            if not is_request_valid(request_data, key_list):
                return Response(
                    {"message": "Invalid params"}, status=status.HTTP_400_BAD_REQUEST
                )

            email = request_data["email"]
            password = request_data["password"]

            if (
                (not isinstance(email, str))
                or (len(email) > 220)
                or (not re.fullmatch(email_regex, email))
                or (not isinstance(password, str))
            ):
                return Response(
                    {"message": "Invalid params"}, status=status.HTTP_400_BAD_REQUEST
                )

            with connection.cursor() as cursor:
                user = request.user
                user_id = user.id

                if not user.check_password(password):
                    return Response(
                        {"message": "Incorrect password"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                cursor.execute(
                    just_change_email(),
                    {
                        "user_id": user_id,
                        "email": email,
                    },
                )
                verif_return = dictfetchall(cursor)[0]

                if verif_return["is_verified"]:
                    return Response(
                        {"message": "Invalid action"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                elif verif_return["is_exist"]:
                    return Response(
                        {"message": "Email is already registered"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                return Response(
                    {"message": "Email has been updated"},
                    status=status.HTTP_200_OK,
                )
        except Exception as e:
            print(f"{type(e)} {e}")
            return Response(
                {"message": "Something went wrong when changing email"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_protect, name="dispatch")
class EmailChangeVerifyView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]
    throttle_scope = "confirm"

    def post(self, request):
        try:
            request_data = request.data
            key_list = ("email", "password", "verification_code")

            if not is_request_valid(request_data, key_list):
                return Response(
                    {"message": "Invalid params"}, status=status.HTTP_400_BAD_REQUEST
                )

            email = request_data["email"]
            password = request_data["password"]
            verification_code = request_data["verification_code"]

            if (
                (not isinstance(email, str))
                or (len(email) > 220)
                or (not re.fullmatch(email_regex, email))
                or (not isinstance(password, str))
                or (not isinstance(verification_code, str))
            ):
                return Response(
                    {"message": "Invalid params"}, status=status.HTTP_400_BAD_REQUEST
                )

            with connection.cursor() as cursor:
                with transaction.atomic():
                    user = request.user
                    user_id = user.id

                    if not user.check_password(password):
                        return Response(
                            {"message": "Incorrect password"},
                            status=status.HTTP_400_BAD_REQUEST,
                        )

                    time_expire = 60  # minutes
                    cursor.execute(
                        confirm_email_verification(),
                        {
                            "user_id": user_id,
                            "email": email,
                            "verification_code": verification_code,
                            "type_verification": type_verification["email_verify"],
                            "time_expire": time_expire,
                        },
                    )
                    verif_return = dictfetchall(cursor)[0]

                    if not verif_return["is_exist"] or verif_return["is_expired"]:
                        return Response(
                            {"message": "Verification code has been expired"},
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                    elif verif_return["is_exceeded"]:
                        return Response(
                            {"message": "You have exceeded the rate limit"},
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                    elif verif_return["is_invalid"]:
                        return Response(
                            {"message": "Invalid verification code"},
                            status=status.HTTP_400_BAD_REQUEST,
                        )

                    return Response(
                        {"message": "Email has been changed"},
                        status=status.HTTP_200_OK,
                    )
        except Exception as e:
            print(f"{type(e)} {e}")
            return Response(
                {"message": "Something went wrong when verifying email"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_protect, name="dispatch")
class PasswordResetView(APIView):
    permission_classes = [
        AllowAny,
    ]
    throttle_scope = "reset"

    def post(self, request):
        try:
            request_data = request.data
            key_list = ("email",)

            if not is_request_valid(request_data, key_list):
                return Response(
                    {"message": "Invalid params"}, status=status.HTTP_400_BAD_REQUEST
                )

            email = request_data["email"]

            if (
                (not isinstance(email, str))
                or (len(email) > 220)
                or (not re.fullmatch(email_regex, email))
            ):
                return Response(
                    {"message": "Invalid email address"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            with connection.cursor() as cursor:
                with transaction.atomic():
                    time_expire = 60  # minutes
                    verification_code = random_int_char()

                    cursor.execute(
                        request_reset_password(),
                        {
                            "email": email,
                            "verification_code": verification_code,
                            "type_verification": type_verification["password_reset"],
                            "time_expire": time_expire,
                        },
                    )
                    request_return = dictfetchall(cursor)[0]

                    if not request_return["is_exist"]:
                        return Response(
                            {"message": f"Account recovery email sent to {email}"},
                            status=status.HTTP_200_OK,
                        )
                        return Response(
                            {"message": "Email is not exist"},
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                    elif request_return["is_verifying"]:
                        return Response(
                            {
                                "message": "Someone has sent a password reset request to this email. If that was you please check your email. If not, please try again after an hour."
                            },
                            status=status.HTTP_200_OK,
                        )

                    rsa_encryption = RSAEncryption()
                    plain_token = json.dumps(
                        {
                            "email": email,
                            "verification_code": verification_code,
                        }
                    )
                    encrypted_token = rsa_encryption.encrypt(plain_token)

                    front_end_url = settings.CORS_ALLOWED_ORIGINS[0]
                    subject = "Password Reset Request for DuoDuo"
                    message = render_to_string(
                        "base/emails/password_reset.html",
                        {
                            "token": urllib.parse.quote_plus(encrypted_token),
                            "front_end_url": front_end_url,
                        },
                    )
                    email_from = settings.EMAIL_HOST_USER
                    recipient_list = [email]
                    SendMailThread(subject, message, email_from, recipient_list).start()

                    return Response(
                        {"message": f"Account recovery email sent to {email}"},
                        status=status.HTTP_200_OK,
                    )
        except Exception as e:
            print(f"{type(e)} {e}")
            return Response(
                {"message": "Something went wrong when resetting password"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_protect, name="dispatch")
class PasswordResetVerifyView(APIView):
    permission_classes = [
        AllowAny,
    ]
    throttle_scope = "confirm"

    def post(self, request):
        try:
            request_data = request.data
            key_list = ("password", "token")

            if not is_request_valid(request_data, key_list):
                return Response(
                    {"message": "Invalid params"}, status=status.HTTP_400_BAD_REQUEST
                )

            token = request_data["token"]
            password = request_data["password"]

            if not isinstance(password, str) or (not isinstance(token, str)):
                return Response(
                    {"message": "Invalid params"}, status=status.HTTP_400_BAD_REQUEST
                )
            elif (
                (not re.fullmatch(password_regex, password))
                or (len(password) < 8)
                or (len(password) > 72)
            ):
                return Response(
                    {"message": "Invalid password"}, status=status.HTTP_400_BAD_REQUEST
                )

            try:
                rsa_encryption = RSAEncryption()
                # urllib.parse.unquote_plus(token) | no need to unquote
                decrypted_token = json.loads(rsa_encryption.decrypt(token))
            except Exception as e:
                print(f"{type(e)} {e}")
                return Response(
                    {"message": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST
                )

            token_keys = (
                "email",
                "verification_code",
            )
            if not is_request_valid(decrypted_token, token_keys):
                return Response(
                    {"message": "Invalid token keys"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            email = decrypted_token["email"]
            verification_code = decrypted_token["verification_code"]

            if (
                (not isinstance(email, str))
                or (len(email) > 220)
                or (not re.fullmatch(email_regex, email))
                or (not isinstance(verification_code, str))
            ):
                return Response(
                    {"message": "Invalid email or verification code"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            with connection.cursor() as cursor:
                with transaction.atomic():
                    time_expire = 60  # minutes
                    hashed_password = make_password(password)

                    cursor.execute(
                        confirm_reset_password(),
                        {
                            "email": email,
                            "verification_code": verification_code,
                            "type_verification": type_verification["password_reset"],
                            "password": hashed_password,
                            "time_expire": time_expire,
                        },
                    )
                    confirm_return = dictfetchall(cursor)[0]

                    if not confirm_return["is_email_exist"]:
                        return Response(
                            {"message": "Email does not exist"},
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                    elif (
                        not confirm_return["is_verify_exist"]
                        or confirm_return["is_expired"]
                    ):
                        return Response(
                            {"message": "Token has been expired"},
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                    elif confirm_return["is_exceeded"]:
                        return Response(
                            {"message": "You have exceeded the rate limit"},
                            status=status.HTTP_400_BAD_REQUEST,
                        )
                    elif confirm_return["is_invalid"]:
                        return Response(
                            {"message": "Invalid verification code"},
                            status=status.HTTP_400_BAD_REQUEST,
                        )

                    front_end_url = settings.CORS_ALLOWED_ORIGINS[0]
                    subject = "DuoDuo Password Changed"
                    message = render_to_string(
                        "base/emails/password_changed.html",
                        {
                            "email": email,
                            "user_username": confirm_return["user_username"],
                            "front_end_url": front_end_url,
                            "discord_url": settings.DISCORD_URL,
                        },
                    )
                    email_from = settings.EMAIL_HOST_USER
                    recipient_list = [email]
                    SendMailThread(subject, message, email_from, recipient_list).start()

                    return Response(
                        {"message": "Password has been reset"},
                        status=status.HTTP_200_OK,
                    )
        except Exception as e:
            print(f"{type(e)} {e}")
            return Response(
                {"message": "Something went wrong when verifying password reset"},
                status=status.HTTP_400_BAD_REQUEST,
            )


# @pending
@method_decorator(csrf_protect, name="dispatch")
class PhoneSendSMSView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]
    throttle_scope = "verify"

    def post(self, request):
        try:
            request_data = request.data
            key_list = ("country_code", "phone_number")

            if not is_request_valid(request_data, key_list):
                return Response(
                    {"message": "Invalid params"}, status=status.HTTP_400_BAD_REQUEST
                )

            country_code = request_data["country_code"]
            phone_number = request_data["phone_number"]

            if (not isinstance(country_code, int)) or (
                not isinstance(phone_number, str)
            ):
                return Response(
                    {"message": "Invalid params"}, status=status.HTTP_400_BAD_REQUEST
                )

            country_code_list = [{"country_code": 1, "length": 12}]
            code_index = next(
                (
                    i
                    for i, e in enumerate(country_code_list)
                    if e["country_code"] == country_code
                ),
                -1,
            )

            if (
                (country_code < 0)
                or (not phone_number.isdigit())
                or (len(phone_number) > country_code_list[code_index]["length"])
            ):
                return Response(
                    {"message": "Invalid params"}, status=status.HTTP_400_BAD_REQUEST
                )
            pass
        except Exception as e:
            print(f"{type(e)} {e}")
            return Response(
                {"message": "Something went wrong when sending sms"},
                status=status.HTTP_400_BAD_REQUEST,
            )


# @pending
@method_decorator(csrf_protect, name="dispatch")
class PhoneVerifyView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]
    throttle_scope = "confirm"

    def post(self, request):
        try:
            request_data = request.data
            key_list = ("phone_number", "verification_code")
            # { "user_id": user_id, "phone": phone, "type_verification": type_verification["phone"] }
            # {"message": "Something went wrong when verifying phone number"},

        except Exception as e:
            print(f"{type(e)} {e}")
            return Response(
                {"message": "Something went wrong when verifying phone number"},
                status=status.HTTP_400_BAD_REQUEST,
            )
