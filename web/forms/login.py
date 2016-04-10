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
__date__ = "$Date: 2016/03/30$"
__revision__ = "$Date: 2016/03/30 $"
__copyright__ = "Copyright (c) "
__license__ = ""

from flask.ext.wtf import Form
from flask import url_for, redirect
from wtforms import validators, TextField, PasswordField, BooleanField, \
                    SubmitField, HiddenField

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
    name = TextField("Name",
        [validators.Required("Please enter your name.")])
    password = PasswordField('Password',
        [validators.Required("Please enter a password.")])
    remember_me = BooleanField("Remember me", default=False)
    submit = SubmitField("Log In")

    def validate(self):
        if not super(LoginForm, self).validate():
            return False

        user = User.query.filter(User.name==self.name.data).first()
        if user and user.check_password(self.password.data):
            return True
        else:
            self.name.errors.append("Invalid name or password")
            return False
