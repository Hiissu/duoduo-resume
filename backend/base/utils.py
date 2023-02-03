from rest_framework.views import exception_handler
from rest_framework.exceptions import Throttled


def custom_exception_handler(exc, context):
    # Call REST framework's default exception handler first, to get the standard error response.
    response = exception_handler(exc, context)

    # if isinstance(exc, Throttled):  # check that a Throttled exception is raised
    #     custom_response_data = {
    #         "message": "Request limit exceeded",
    #         "availableIn": "%d seconds" % exc.wait,
    #     }
    #     response.data = (
    #         custom_response_data  # set the custom response data on response object
    #     )

    # Now add the HTTP status code to the response.
    if response is not None:
        if response.status_code == 429:
            response.data["message"] = "Too many requests. Try again in a hour."
            # response.data["available"] = exc.wait
        else:
            # response.data['status_code'] = response.status_code
            # response.data['extra'] = {}
            response.data["message"] = response.data["detail"]

        del response.data["detail"]

    return response
