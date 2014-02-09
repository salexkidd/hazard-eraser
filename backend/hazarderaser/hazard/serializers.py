# -*- coding:utf-8 -*-
"""
hazard serializers
"""
#django restframework modules
from rest_framework import serializers

#libs modules
from libs.common import serializers as common_serializers

#product modules
import models as hazard_models


class Hazard(serializers.ModelSerializer):
    """ Hazard Serializer class """
    user = common_serializers.User()
    class Meta:
        model = hazard_models.Hazard


class HazardCreate(serializers.ModelSerializer):
    """ Hazard Serializer class """
    class Meta:
        model = hazard_models.Hazard
        exclude = (
            "user",
            "create_date",
            "update_date",
        )
