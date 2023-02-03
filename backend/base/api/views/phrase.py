from django.conf import settings
from django.db import connection, reset_queries, transaction
from django.http import FileResponse, JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from rest_framework import generics, status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from base.api.queries.fetch import *
from base.models import *


@method_decorator(csrf_protect, name="dispatch")
class PhrasesGetView(APIView):
    permission_classes = [IsAuthenticated, ]
    throttle_scope = 'limit_get'

    def get(self, request, language_code):
        try:
            language_list = list(dict(Language.language_list).keys())
            if language_code in language_list:
                file_path = settings.BASE_DIR / \
                    f"documents/phrases/{language_code}_phrases.json"
                return FileResponse(open(file_path, "rb"))
            return Response({"message": "Language code does not exist"}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({"message": "Something went wrong when retrieving phrases"}, status=status.HTTP_400_BAD_REQUEST)
