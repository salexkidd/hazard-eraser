# -*- coding:utf-8 -*-
"""
hazard api module
"""
#Django modules
from django.utils.translation import ugettext as _
from django.templatetags.static import static as static_url
from django.core.urlresolvers import reverse

#Django restframework modules
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status as http_status

#hazard modules
import models as hazard_models
import serializers as hazard_serializers


class HazardViewSet(viewsets.ModelViewSet):
    """ Hazard Viewset class """
    queryset = hazard_models.Hazard.objects.all()
    serializer_class = hazard_serializers.Hazard
