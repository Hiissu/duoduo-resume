from django.http import JsonResponse
from rest_framework import status


def page_not_found_view(request, exception):
    return JsonResponse({"message": "You lost?"}, status=status.HTTP_404_NOT_FOUND)


def error_view(request, exception=None):
    return JsonResponse({"message": "Something went wrong"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def permission_denied_view(request, exception=None):
    return JsonResponse({"message": "Access denied."}, status=status.HTTP_403_FORBIDDEN)


def bad_request_view(request, exception=None):
    return JsonResponse({"message": "Bad request."}, status=status.HTTP_400_BAD_REQUEST)
