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
from web.models import User, Shelter, Property, Association

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
    return True

def shelter_POST_preprocessor(data=None, **kw):
    """
    POST preprocessor for the creation of shelter.
    """
    data["user_id"] = current_user.id
    if current_user.is_admin:
        data["is_published"] = True
        #flash("Your shelter has been created." +
        #      " You can already edit it by clicking on the pen to the right of the screen.",
        #     'success')
    #else:
    #    flash("Thank you for entering your shelter in the shelter database. Your shelter " +
	#			  "will be visible in the database after a short review by the administrator. " +
	#		  "We kindly request you to add additional data about your shelter, such as " + 
	#		  "technical documentation and drawings, and different attributes. You can edit your " +
	#		  "shelter when you log in to the website and go to 'your shelters'.", 'success');

def value_edit_preprocessor(data=None, **kw):
    """value PUT preprocessor, to disallow unauthorized editing of shelters"""
   
    query = Shelter.query.join(Property)\
        .join(Association)\
        .filter(Association.value_id==kw['instance_id'])\
        .first()
    
    if current_user.is_admin:
        Shelter.query.filter(Shelter.id==query.id). \
                        update({"updated_at": datetime.datetime.now()})
    elif current_user.id == query.user_id:
        Shelter.query.filter(Shelter.id==query.id). \
                        update({"updated_at": datetime.datetime.now()})
    else:
        raise ProcessingException(description='Unauthorized to edit!', code=401)
    

def property_preprocessor(data=None, **kw):
    """
    preprocessor for the creation/update of properties.
    """
    Shelter.query.filter(Shelter.id==data["shelter_id"]). \
                        update({"updated_at": datetime.datetime.now()})
