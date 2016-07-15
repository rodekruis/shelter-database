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
__date__ = "$Date: 2016/06/08 $"
__revision__ = "$Date: 2016/06/08 $"
__copyright__ = "Copyright 2016 Luxembourg Institute of Science and Technology"
__license__ = ""

from flask_wtf import Form
from flask import url_for, redirect, flash
from wtforms import validators, TextField, BooleanField, PasswordField, \
                    SubmitField
from flask_wtf.html5 import EmailField

from web.models import User

class CreateUserForm(Form):
    """
    Create a user (for the administrator).
    """
    name = TextField("Name",
            [validators.Required("Please enter your name.")])
    email = EmailField("Email",
                [validators.Length(min=6, max=35),
                validators.Required("Please enter an email.")])
    is_admin = BooleanField("Admin")
    password = PasswordField("Password",
                [validators.Length(min=6, max=100),
                validators.Required("Please enter a password.")])
    submit = SubmitField("Save")

    def validate(self):
        validated = super(CreateUserForm, self).validate()
        if self.name.data != User.make_valid_name(self.name.data):
            self.name.errors.append(
                    'This name has invalid characters. '
                    'Please use letters, numbers, dots and underscores only.')
            validated = False
        user = User.query.filter(User.email==self.email.data).first()
        if user:
            self.email.errors.append('This email is already used.')
            validated = False
        return validated

class EditUserForm(Form):
    """
    Edit a user (for the administrator).
    """
    name = TextField("Name",
            [validators.Required("Please enter your name.")])
    email = EmailField("Email",
                [validators.Length(min=6, max=35),
                validators.Required("Please enter an email.")])
    is_admin = BooleanField("Admin")
    password = PasswordField("Password")
    submit = SubmitField("Save")

    def validate(self):
        validated = super(EditUserForm, self).validate()
        if self.name.data != User.make_valid_name(self.name.data):
            self.name.errors.append(
                    'This name has invalid characters. '
                    'Please use letters, numbers, dots and underscores only.')
            validated = False
        return validated
