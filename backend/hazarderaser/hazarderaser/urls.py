# -*- coding:utf-8 -*-
"""
hazarderaser urls module
"""
#django modules
from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView
from django.contrib import admin


admin.autodiscover()

urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),

    url(r'^$', TemplateView.as_view(template_name="top.html"),
        name="top_view",),

    url(r'^hazard/', include('hazard.urls')),

    #social_auth
    url(r'', include('social_auth.urls')),

    #logout
    url(r'^logout/$', 'django.contrib.auth.views.logout',
        {'next_page': '/'}, name="auth_logout",),

    #login
    url(r'^login/$', 'django.contrib.auth.views.login',
        {'template_name': 'login.html'}, name="login-form",),
)
