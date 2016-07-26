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
__date__ = "$Date: 2016/06/06 $"
__revision__ = "$Date: 2016/06/06 $"
__copyright__ = "Copyright 2016 Luxembourg Institute of Science and Technology"
__license__ = ""

from flask_wtf import Form
from flask import url_for, redirect
from wtforms import validators, TextField, PasswordField, SelectField, \
                    SubmitField, HiddenField
from flask_wtf.html5 import EmailField
from sqlalchemy import distinct

from bootstrap import db
from web.models import User, Translation

class ProfileForm(Form):
    """
    Edit user own information.
    """
    name = TextField("Nickname",
            [validators.Required("Please enter your nickname.")])
    email = EmailField("Email",
               [validators.Length(min=6, max=35),
                validators.Required("Please enter your email.")])
    preferred_language = SelectField("Preferred language")
    password = PasswordField("Password")
    password_conf = PasswordField("Password Confirmation")
    submit = SubmitField("Save")

    def set_languages_choice(self):
        self.preferred_language.choices = [('en', 'en')]
        languages = [(language[0], language[0]) for language in \
                        db.session.query(distinct(Translation.language_code))]
        self.preferred_language.choices.extend(languages)

    def validate(self):
        validated = super(ProfileForm, self).validate()
        if self.password.data != self.password_conf.data:
            message = "Passwords aren't the same."
            self.password.errors.append(message)
            self.password_conf.errors.append(message)
            validated = False
        if self.name.data != User.make_valid_name(self.name.data):
            self.name.errors.append('This nickname has '
                    'invalid characters. Please use letters, numbers, dots and'
                    ' underscores only.')
            validated = False
        return validated
