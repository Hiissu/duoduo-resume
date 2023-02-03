from rest_framework.throttling import UserRateThrottle


class TenPerTenMinutesThrottle(UserRateThrottle):
    scope = "limit_get"

    def allow_request(self, request, view):
        if (
            request.method == "POST"
            or request.method == "PATCH"
            or request.method == "DELETE"
        ):
            return True
        return super().allow_request(request, view)

    def parse_rate(self, rate):
        """
        Given the request rate string, return a two tuple of:
        <allowed number of requests>, <period of time in seconds>

        So we always return a rate for 10 request per 10 minutes.

        Args:
            string: rate to be parsed, which we ignore.

        Returns:
            tuple:  <allowed number of requests>, <period of time in seconds>
        """
        # 10 Requests per 600 seconds (10 minutes)
        return (10, 600)


# For Revision
class GetRevisionRateThrottle(UserRateThrottle):
    scope = "get"

    def allow_request(self, request, view):
        if request.method == "POST":
            return True
        return super().allow_request(request, view)


class PostRevisionRateThrottle(UserRateThrottle):
    scope = "post"

    def allow_request(self, request, view):
        if request.method == "GET":
            return True
        return super().allow_request(request, view)


# For Translation
class GetTranslationRateThrottle(UserRateThrottle):
    scope = "get"

    def allow_request(self, request, view):
        if request.method == "POST":
            return True
        return super().allow_request(request, view)


class PostTranslationRateThrottle(UserRateThrottle):
    scope = "limit_post"

    def allow_request(self, request, view):
        if request.method == "GET":
            return True
        return super().allow_request(request, view)


class PatchTranslationRateThrottle(UserRateThrottle):
    scope = "limit_patch"

    def allow_request(self, request, view):
        if request.method == "DELETE":
            return True
        return super().allow_request(request, view)


class DeleteTranslationRateThrottle(UserRateThrottle):
    scope = "limit_delete"

    def allow_request(self, request, view):
        if request.method == "PATCH":
            return True
        return super().allow_request(request, view)


# For Collections
class GetCollectionsRateThrottle(UserRateThrottle):
    scope = "get"

    def allow_request(self, request, view):
        if request.method == "POST":
            return True
        return super().allow_request(request, view)


class PostCollectionsRateThrottle(UserRateThrottle):
    scope = "limit_post"

    def allow_request(self, request, view):
        if request.method == "GET":
            return True
        return super().allow_request(request, view)


# For Collection
class GetCollectionRateThrottle(UserRateThrottle):
    scope = "get"

    def allow_request(self, request, view):
        if request.method == "DELETE":
            return True
        return super().allow_request(request, view)


class DeleteCollectionRateThrottle(UserRateThrottle):
    scope = "limit_delete"

    def allow_request(self, request, view):
        if request.method == "GET":
            return True
        return super().allow_request(request, view)


# For CollectionLearning
class PostCollectionLearningRateThrottle(UserRateThrottle):
    scope = "limit_post"

    def allow_request(self, request, view):
        if request.method == "DELETE":
            return True
        return super().allow_request(request, view)


class DeleteCollectionLearningRateThrottle(UserRateThrottle):
    scope = "limit_delete"

    def allow_request(self, request, view):
        if request.method == "POST":
            return True
        return super().allow_request(request, view)


# For Unit
class GetUnitRateThrottle(UserRateThrottle):
    scope = "get"

    def allow_request(self, request, view):
        if request.method == "DELETE":
            return True
        return super().allow_request(request, view)


class DeleteUnitRateThrottle(UserRateThrottle):
    scope = "limit_delete"

    def allow_request(self, request, view):
        if request.method == "GET":
            return True
        return super().allow_request(request, view)


# For Meow
class GetMeowRateThrottle(UserRateThrottle):
    scope = "get"

    def allow_request(self, request, view):
        if request.method == "PATCH":
            return True
        return super().allow_request(request, view)


class PatchMeowRateThrottle(UserRateThrottle):
    scope = "verify"

    def allow_request(self, request, view):
        if request.method == "GET":
            return True
        return super().allow_request(request, view)
