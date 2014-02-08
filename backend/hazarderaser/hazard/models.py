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

class Hazard(models.Model):
    """ Hazard Model """
    user = models.ForeignKey(
        auth_models.User, null=False, blank=False,
        help_text="Related User",
    )

    status = models.PositiveIntegerField(
        choices=HAZARD_STATUS, null=False, blank=False,
        help_text="hazard_status",
    )

    comment = models.TextField(
        max_length=500, null=True, blank=True,
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
        help_text="Picture",
    )
