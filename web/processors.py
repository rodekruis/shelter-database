#! /usr/bin/env python
#-*- coding: utf-8 -*-

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
__date__ = "$Date: 2016/03/30 $"
__revision__ = "$Date: 2016/06/12 $"
__copyright__ = "Copyright (c) "
__license__ = ""

import datetime
from flask import request, flash
from flask_login import current_user
from flask_restless import ProcessingException

from web.views.common import login_user_bundle
from web.models import User, Shelter

def auth_func(*args, **kw):
    if request.authorization:
        user = User.query.filter(name==request.authorization.username).first()
        if not user:
            raise ProcessingException("Couldn't authenticate your user",
                                        code=401)
        if not user.check_password(request.authorization.password):
            raise ProcessingException("Couldn't authenticate your user",
                                        code=401)
        if not user.is_active:
            raise ProcessingException("User is desactivated", code=401)
        login_user_bundle(user)
    if not current_user.is_authenticated:
        raise ProcessingException(description='Not authenticated!', code=401)

def shelter_POST_preprocessor(data=None, **kw):
    """
    POST preprocessor for the creation of shelter.
    """
    data["user_id"] = current_user.id
    if current_user.is_admin:
        data["is_published"] = True
        flash("Your shelter has been created.", 'success')
    else:
        flash("Thank you! Your shelter has been created but is not yet public." +
            " An administrator will review it. You can already edit it.",
            'success')


def property_preprocessor(data=None, **kw):
    """
    preprocessor for the creation/update of properties.
    """
    Shelter.query.filter(Shelter.id==data["shelter_id"]). \
                        update({"updated_at": datetime.datetime.now()})
