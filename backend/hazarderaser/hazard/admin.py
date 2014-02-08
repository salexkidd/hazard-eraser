# -*- coding:utf-8 -*-
"""
hazard admin module
"""
#django modules
from django.contrib import admin

#contact modules
import models as hazard_models


class HazardAdmin(admin.ModelAdmin):
    """ Hazard Admin """
    pass


admin.site.register(hazard_models.Hazard, HazardAdmin)
