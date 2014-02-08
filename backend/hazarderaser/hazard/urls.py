# -*- coding:utf-8 -*-
"""
hazard urls module
"""
#django modules
from django.conf.urls import patterns, include, url

#django restframework modules
from rest_framework import routers

#hazard modules
import apis as hazard_apis

#API
v1_router = routers.SimpleRouter()
v1_router.register(r'hazard', hazard_apis.HazardViewSet)


urlpatterns = patterns('',
   url(r'^api/v1/', include(v1_router.urls, namespace="v1")),
)
