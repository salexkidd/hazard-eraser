# -*- coding:utf-8 -*-
"""
hazarderaser urls module
"""
#django modules
from django.conf.urls import patterns, include, url
from django.contrib import admin


admin.autodiscover()

urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),
    url(r'^hazard/', include('hazard.urls')),
)
