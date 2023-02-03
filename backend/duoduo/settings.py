"""
Django settings for duoduo project.

Generated by 'django-admin startproject' using Django dev.

For more information on this file, see
https://docs.djangoproject.com/en/dev/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/dev/ref/settings/
"""

from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/dev/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = _

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True


# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "base.apps.BaseConfig",
    "rest_framework",
    "corsheaders",
    "debug_toolbar",
]

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:8000",
]

ALLOWED_HOSTS = [
    ".localhost",
    "127.0.0.1",
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:8000",
]
CORS_ALLOW_CREDENTIALS = True

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "debug_toolbar.middleware.DebugToolbarMiddleware",
]

INTERNAL_IPS = [
    "127.0.0.1",
    "192.0.0.1",
]

ROOT_URLCONF = "duoduo.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "duoduo.wsgi.application"


# Database
# https://docs.djangoproject.com/en/dev/ref/settings/#databases

DATABASES = {
    # 'default': {
    #     'ENGINE': 'django.db.backends.sqlite3',
    #     'NAME': BASE_DIR / 'db.sqlite3',
    # }
    "default": {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
        "NAME": "duoduo",
        "USER": _,
        "PASSWORD": _,
        "HOST": "localhost",
        "PORT": "5432",
    }
}

# AUTH_USER_MODEL = 'base.User'

REST_FRAMEWORK = {
    "DEFAULT_PERMISSON_CLASSES": ("rest_framework.permissons.IsAuthenticated",),
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework.authentication.SessionAuthentication",
    ),
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 25,
    "DEFAULT_THROTTLE_CLASSES": [
        # 'rest_framework.throttling.AnonRateThrottle',
        # 'rest_framework.throttling.UserRateThrottle',
        "rest_framework.throttling.ScopedRateThrottle",
    ],
    "EXCEPTION_HANDLER": "base.utils.custom_exception_handler",
    "DEFAULT_THROTTLE_RATES": {
        "get": "200/hour",
        "put": "200/hour",
        "patch": "200/hour",
        "post": "200/hour",
        "delete": "200/hour",
        "search": "400/hour",
        "limit_get": "100/hour",
        "limit_put": "100/hour",
        "limit_patch": "100/hour",
        "limit_post": "100/hour",
        "limit_delete": "100/hour",
        "limit_search": "200/hour",
        "complete": "50/hour",
        "reset": "200/hour",
        "verify": "200/hour",
        "confirm": "200/hour",
        "test_get": "2/hour",
        "test_post": "3/hour",
        "test_patch": "4/hour",
        "test_delete": "5/hour",
    },
}

# CACHES = {
#     'default': {
#         'BACKEND': 'django.core.cache.backends.memcached.PyMemcacheCache',
#         'LOCATION': '127.0.0.1:11211',
#     }
# }

# AUTHENTICATION_BACKENDS = ["base.backends.AuthWithEmail"]

# Password validation
# https://docs.djangoproject.com/en/dev/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
        "OPTIONS": {
            "min_length": 8,
        },
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.ScryptPasswordHasher",
    "django.contrib.auth.hashers.PBKDF2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher",
    "django.contrib.auth.hashers.Argon2PasswordHasher",
    "django.contrib.auth.hashers.BCryptSHA256PasswordHasher",
]

# Internationalization
# https://docs.djangoproject.com/en/dev/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/dev/howto/static-files/

STATIC_URL = "/static/"


STATICFILES_DIRS = [
    BASE_DIR / "static",
]
MEDIA_URL = "/images/"
MEDIA_ROOT = BASE_DIR / "static/images"

LOGIN_REDIRECT_URL = "home"
LOGIN_URL = "login"


# Default primary key field type
# https://docs.djangoproject.com/en/dev/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# SMTP Configuration

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = _
EMAIL_HOST_PASSWORD = _