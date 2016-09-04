#! /usr/bin/env python
# -*- coding: utf-8 -*-

# ***** BEGIN LICENSE BLOCK *****
# This file is part of Shelter Database.
# Copyright (c) 2016 Luxembourg Institute of Science and Technology.
# All rights reserved.
#
#
#
# ***** END LICENSE BLOCK *****

__author__ = "Cedric Bonhomme"
__version__ = "$Revision: 0.1 $"
__date__ = "$Date: 2016/07/11 $"
__revision__ = "$Date: 2016/07/11 $"
__copyright__ = "Copyright (c) "
__license__ = ""

import datetime
from flask import render_template
import conf
from web.notifications import emails

def new_account_creation(user):
    """
    Account creation notification.
    """
    plaintext = render_template('emails/account_creation.txt',
                                user=user, platform_url=conf.PLATFORM_URL)
    emails.send(to=user.email,
                bcc=conf.NOTIFICATION_EMAIL,
                subject="[Shelter Database] Account creation",
                plaintext=plaintext)

def new_shelter_creation(shelter):
    """
    Shelter creation notification.
    """
    from web.models import User
    admins = User.query.filter(User.is_admin==True).all()
    recipients = ", ".join([user.email for user in admins])
    plaintext = render_template('emails/shelter_creation.txt',
                                shelter=shelter, platform_url=conf.PLATFORM_URL)
    emails.send(to=recipients,
                bcc=conf.NOTIFICATION_EMAIL,
                subject="[Shelter Database] Shelter creation",
                plaintext=plaintext)
