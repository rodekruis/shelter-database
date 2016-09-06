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
__revision__ = "$Date: 2016/03/30 $"
__copyright__ = "Copyright 2016 Luxembourg Institute of Science and Technology"
__license__ = ""

from flask_wtf import Form
from flask import url_for, redirect
from wtforms import validators, TextField, PasswordField, \
                    SubmitField, HiddenField
from flask_wtf.html5 import EmailField

from web.models import User
from web.lib import utils

class RedirectForm(Form):
    """
    Secure back redirects with WTForms.
    """
    next = HiddenField()

    def __init__(self, *args, **kwargs):
        Form.__init__(self, *args, **kwargs)
        if not self.next.data:
            self.next.data = utils.get_redirect_target() or ''

    def redirect(self, endpoint='start', **values):
        if utils.is_safe_url(self.next.data):
            return redirect(self.next.data)
        target = utils.get_redirect_target()
        return redirect(target or url_for(endpoint, **values))

class LoginForm(RedirectForm):
    """
    Login form.
    """
    email = TextField("Email",
        [validators.Required("Please enter your email address.")])
    password = PasswordField('Password',
        [validators.Required("Please enter a password.")])
    submit = SubmitField("Log In")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.user = None

    def validate(self):
        if not super(LoginForm, self).validate():
            return False

        user = User.query.filter(User.email==self.email.data).first()
        if user and user.check_password(self.password.data):
            self.user = user
            return True
        else:
            self.email.errors.append("Invalid name or password")
            return False

class SignupForm(RedirectForm):
    """
    Sign up form (registration).
    """
    name = TextField("Name",
            [validators.Required("Please enter your name.")])
    email = EmailField("Email",
            [validators.Length(min=6, max=35),
             validators.Required("Please enter your email address.")])
    password = PasswordField("Password",
            [validators.Required("Please enter a password."),
             validators.Length(min=6, max=100)])
    submit = SubmitField("Sign up")

    def validate(self):
        validated = super().validate()
        user = User.query.filter(User.email==self.email.data).first()
        if user:
            self.email.errors.append('Email already taken')
            validated = False
        return validated
