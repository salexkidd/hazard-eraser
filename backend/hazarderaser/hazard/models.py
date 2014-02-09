# -*- coding:utf-8 -*-
"""
hazard models module
"""
#Django module
from django.db import models
from django.utils.translation import ugettext as _
from django.contrib.auth import models as auth_models


HAZARD_STATUS = (
    (1, "報告中"),
    (2, "完了"),
    (3, "再報告"),
)

EMERGENCY_LEVEL = (
    (1, "INFO"),
    (2, "WARNING"),
    (3, "EMERGENCY"),
)

class Tag(models.Model):
    """ タグ """
    enable = models.BooleanField(
        null=False, blank=False, default=True,
        help_text=_("enable"),
    )

    name = models.CharField(
        max_length=100, null=False, blank=False,
        help_text=_("Tag name"),
    )

    level = models.PositiveIntegerField(
        choices=EMERGENCY_LEVEL, null=False, blank=False,
        help_text=_("Level"),
    )


class Hazard(models.Model):
    """ Hazard Model """
    user = models.ForeignKey(
        auth_models.User, null=False, blank=False,
        help_text=_("Related User"),
    )

    status = models.PositiveIntegerField(
        choices=HAZARD_STATUS, null=False, blank=False,
        help_text=_("hazard_status"),
    )

    latitude = models.FloatField(
        null=False, blank=False,
        help_text=_("latitude"),
    )

    longitude = models.FloatField(
        null=False, blank=False,
        help_text=_("longitude"),
    )

    comment = models.TextField(
        max_length=500, null=True, blank=True,
        help_text=_("comment")
    )

    create_date = models.DateTimeField(
        null=False, blank=False, auto_now=True, auto_now_add=True,
        help_text=_("create date"),
    )

    update_date = models.DateTimeField(
        null=False, blank=False, auto_now=True, auto_now_add=False,
        help_text=_("update date"),
    )


class Picture(models.Model):
    """ Picture Model """
    hazard = models.ForeignKey(
        Hazard, null=False, blank=False,
        help_text=_("Picture"),
    )
