# -*- coding:utf-8 -*-
"""
hazard api module
"""
#Django modules
from django.utils.translation import ugettext as _
from django.templatetags.static import static as static_url
from django.core.urlresolvers import reverse
from django.conf import settings
from django.views.generic import View, TemplateView
from django.http import HttpResponseForbidden


#Django restframework modules
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status as http_status

#hazard modules
import permissions as hazard_permission
import models as hazard_models
import serializers as hazard_serializers


class HazardViewSet(viewsets.ModelViewSet):
    """ Hazard Viewset class """
    queryset = hazard_models.Hazard.objects.all()
    serializer_class = hazard_serializers.Hazard
    permission_classes = (hazard_permission.HazardPermission, )
    
    def create(self, request, *args, **kwargs):
        """ create object """
        if request.user.is_anonymous():
            return Response(
                "unauthorized",
                status=http_status.HTTP_401_UNAUTHORIZED
            )

        serializer = hazard_serializers.HazardCreate(data=request.DATA)

        if serializer.is_valid():
            hazard = serializer.object
            hazard.user = request.user
            hazard.save()

        else:
            return Response(
                "Can't craete hazard data: {}".format(e.message),
                status=http_status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response(
            "Created hazard data",
            status=http_status.HTTP_201_CREATED
        )
