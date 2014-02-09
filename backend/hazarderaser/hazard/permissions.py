# -*- coding:utf-8 -*-
"""
hazard permission module
"""
#django restframework modules
from rest_framework import permissions


class HazardPermission(permissions.BasePermission):
    """ HazardPermission """
    def has_object_permission(self, request, view, obj):
        """
        Return `True` if permission is granted, `False` otherwise.
        """
        if request.user.is_staff:
            return True

        if request.user == obj.user:
            return True

        return False

