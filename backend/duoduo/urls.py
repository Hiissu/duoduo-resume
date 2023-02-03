"""duoduo URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from django.views.static import serve
import debug_toolbar

handler400 = 'base.views.bad_request_view'
handler403 = 'base.views.permission_denied_view'
handler404 = 'base.views.page_not_found_view'
handler500 = 'base.views.error_view'

urlpatterns = [

    path('', TemplateView.as_view(template_name="index.html")),
    path('api/', include('base.urls')),
    path('admin/', admin.site.urls),

    # path('static/images/<string>/',  serve,
    #      {'document_root': settings.MEDIA_ROOT}),
    # url(r'^media/(?P<path>.*)$', serve,
    #     {'document_root': settings.MEDIA_ROOT}),
    # path(r'^static/(?P<path>.*)$', serve,
    #      {'document_root': settings.STATIC_ROOT}),

    path('__debug__/', include(debug_toolbar.urls)),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
