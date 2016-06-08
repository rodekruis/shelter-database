#! /usr/bin/env python
#-*- coding: utf-8 -*-

# ***** BEGIN LICENSE BLOCK *****
# This file is part of Shelter Database.
# Copyright (c) 2016
# All rights reserved.
#
#
#
# ***** END LICENSE BLOCK *****

__author__ = "Cedric Bonhomme"
__version__ = "$Revision: 0.1 $"
__date__ = "$Date: 2016/06/08 $"
__revision__ = "$Date: 2016/06/08 $"
__copyright__ = "Copyright (c) "
__license__ = ""

from flask_wtf import Form
from flask import url_for, redirect
from wtforms import validators, TextField, PasswordField, \
                    SubmitField
from flask_wtf.html5 import EmailField

from web.models import User

class UserForm(Form):
    """
    Create or edit a user (for the administrator).
    """
    name = TextField("Name",
            [validators.Required("Please enter your name.")])
    email = EmailField("Email",
               [validators.Length(min=6, max=35),
                validators.Required("Please enter your email.")])
    password = PasswordField("Password")
    submit = SubmitField("Save")

    def validate(self):
        validated = super(UserForm, self).validate()
        if self.name.data != User.make_valid_name(self.name.data):
            self.name.errors.append(
                    'This nickname has invalid characters. '
                    'Please use letters, numbers, dots and underscores only.')
            validated = False
        return validated
