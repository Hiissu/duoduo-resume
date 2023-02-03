from django.conf import settings
from django.db import connection, reset_queries, transaction
from django.http import FileResponse, JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from rest_framework import generics, status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from base.api.queries.course import *
from base.api.queries.fetch import *
from base.api.queries.profile import *
from base.models import *


@method_decorator(csrf_protect, name="dispatch")
class CoursesGetView(APIView):
    permission_classes = [
        AllowAny,
    ]
    # throttle_scope = "limit_get"
    throttle_scope = "get"

    def get(self, request):
        try:
            file_path = settings.BASE_DIR / f"documents/courses/courses.json"
            return FileResponse(open(file_path, "rb"))
        except:
            return Response(
                {"message": "Something went wrong when retrieving courses"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@method_decorator(csrf_protect, name="dispatch")
class CourseEnrollView(APIView):
    permission_classes = [
        IsAuthenticated,
    ]
    throttle_scope = "limit_post"

    def post(self, request, course_id):
        try:
            with connection.cursor() as cursor:
                with transaction.atomic():
                    user = request.user
                    user_id = user.id

                    cursor.execute(
                        enroll_course(),
                        {
                            "user_id": user_id,
                            "course_id": course_id,
                        },
                    )
                    course_return = dictfetchall(cursor)

                    if not course_return["is_exist"]:
                        return Response(
                            {"message": "Course does not exist"},
                            status=status.HTTP_400_BAD_REQUEST,
                        )

                    return Response(
                        {"message": "Course learning has been changed"},
                        status=status.HTTP_200_OK,
                    )
        except Exception as e:
            print(f"{type(e)} {e}")
            return Response(
                {"message": "Something went wrong when enrolling course"},
                status=status.HTTP_400_BAD_REQUEST,
            )
