from django.conf import settings
from django.http import FileResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from base.models import *


@method_decorator(csrf_protect, name='dispatch')
class CategoriesGetView(APIView):
    permission_classes = [IsAuthenticated, ]
    throttle_scope = 'limit_get'

    def get(self, request):
        try:
            file_path = settings.BASE_DIR / "documents/categories/categories.json"
            return FileResponse(open(file_path, 'rb'))
        except Exception as e:
            print(f"{type(e)} {e}")
            return Response({"message": "Something went wrong when retrieving categories"}, status=status.HTTP_400_BAD_REQUEST)
