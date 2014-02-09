# -*- coding:utf-8 -*-
"""
common serializers
"""
#user
from django.contrib.auth import models as auth_models

#django restframework modules
from rest_framework import serializers


class User(serializers.ModelSerializer):
    """ User Serializer """
    class Meta:
        model = auth_models.User
        exclude = (
            "password",
            "is_staff",
            "is_active",
            "groups",
            "user_permissions",
            "is_superuser",
        )
