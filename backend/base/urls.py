from django.urls import path

from base.api.views.authentication import *
from base.api.views.category import *
from base.api.views.collection import *
from base.api.views.course import *
from base.api.views.learn import *
from base.api.views.phrase import *
from base.api.views.profile import *
from base.api.views.sentence import *
from base.api.views.unit import *
from base.api.views.user import *
from base.api.views.verification import *
from base.api.views.word import *
from base.api.views.word_translation import *

from .views import *

urlpatterns = [
    # Authentication Section
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),
    path("logout/", LogoutView.as_view()),
    # @pending
    # path('phone_verifications/send_sms/', PhoneSendSMSView.as_view()),
    # path('phone_verifications/verify/', PhoneVerifyView.as_view()),
    path("password_reset/", PasswordResetView.as_view()),
    path("password_reset/verify/", PasswordResetVerifyView.as_view()),
    path("email_verifications/", EmailVerifyView.as_view()),
    path("email_verifications/verify/", EmailConfirmVerifyView.as_view()),
    path("email_change/", EmailChangeView.as_view()),
    path("email_change/verify/", EmailChangeVerifyView.as_view()),
    path("username_exist/", UsernameExistView.as_view()),
    path("username_change/", UsernameChangeView.as_view()),
    # Profile & User Section
    path("meow/", MeowGetView.as_view()),
    path("profile/", ProfilePatchView.as_view()),
    path("profiles/<str:username>/", ProfileGetView.as_view()),
    # Learn Section
    path("learned/", LearnedGetView.as_view()),
    path("practice/", PracticeView.as_view()),
    path("complete/", CompleteView.as_view()),
    # File Section
    path("words/<str:language_code>/", WordsGetView.as_view()),
    path("phrases/<str:language_code>/", PhrasesGetView.as_view()),
    path("sentences/<str:language_code>/", SentencesGetView.as_view()),
    # Course Section
    path("courses/", CoursesGetView.as_view()),
    path("courses/<int:course_id>/enroll/", CourseEnrollView.as_view()),
    # Category Section
    path("categories/", CategoriesGetView.as_view()),
    # Collection Section
    path("collections/", CollectionsGetCreateView.as_view()),
    path("collections/search", CollectionsSearchView.as_view()),
    path("collections/learning/", CollectionsLearningGetView.as_view()),
    path("collections/learning/search", CollectionsLearningSearchView.as_view()),
    # @pending
    # path("collections/created/", CollectionsCreatedGetView.as_view()),
    # path("collections/created/search", CollectionsCreatedSearchView.as_view()),
    path("collections/<int:collection_id>/", CollectionGetDeleteView.as_view()),
    path(
        "collections/<int:collection_id>/overview/",
        CollectionPatchOverviewView.as_view(),
    ),
    path(
        "collections/<int:collection_id>/documents/",
        CollectionPatchDocumentsView.as_view(),
    ),
    path("collections/<int:collection_id>/learn/", CollectionLearningView.as_view()),
    # Unit Section
    path("collections/<int:collection_id>/units/", UnitCreateView.as_view()),
    path("units/<int:unit_id>/", UnitGetDeleteView.as_view()),
    path("units/<int:unit_id>/core/", UnitPatchCoreView.as_view()),
    path("units/<int:unit_id>/overview/", UnitPatchOverviewView.as_view()),
    # Word Translation Section
    path("words/<int:word_id>/translations/", WordTranslationGetCreateView.as_view()),
    path(
        "words/translations/<int:translation_id>/",
        WordTranslationPatchDeleteView.as_view(),
    ),
    path(
        "words/translations/<int:translation_id>/revision/",
        WordTranslationRevisionGetCreateView.as_view(),
    ),
    # @deprecated
    # path('csrfcookie/', GetCSRFToken.as_view()),
    # path("authenticated/", AuthenticatedCheckView.as_view()),
    # path("words/<int:word_id>/translations/search", WordTranslationsSearchView.as_view()),
    # path("words/translations/<int:translation_id>/use/", WordTranslationUseView.as_view()),
    # path("words/translations/<int:translation_id>/remove/", WordTranslationRemoveView.as_view()),
]
