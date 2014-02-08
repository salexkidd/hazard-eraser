# -*- coding:utf-8 -*-
"""
hazard serializers
"""
#django restframework modules
from rest_framework import serializers

#product modules
import models as hazard_models


class Hazard(serializers.ModelSerializer):
    """ Hazard Serializer class """
    class Meta:
        model = hazard_models.Hazard
