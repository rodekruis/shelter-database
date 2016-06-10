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
__date__ = "$Date: 2016/05/31$"
__revision__ = "$Date: 2016/05/31 $"
__copyright__ = "Copyright (c) "
__license__ = ""

import json
import logging

from werkzeug import generate_password_hash
from werkzeug.exceptions import NotFound
from flask import (render_template, flash, session, request,
                   url_for, redirect, current_app)
from flask_babel import gettext
from flask_login import LoginManager, logout_user, \
                            login_required, current_user
from flask_principal import (Principal, AnonymousIdentity, UserNeed,
                                 identity_changed, identity_loaded,
                                 session_identity_loader)

import conf
from bootstrap import db
from web.views.common import admin_role, login_user_bundle
from web.models import User
from web.forms import LoginForm, SignupForm
#from notifications import notifications

Principal(current_app)
# Create a permission with a single Need, in this case a RoleNeed.

login_manager = LoginManager()
login_manager.init_app(current_app)
login_manager.login_view = 'join'

logger = logging.getLogger(__name__)


@identity_loaded.connect_via(current_app._get_current_object())
def on_identity_loaded(sender, identity):
    # Set the identity user object
    identity.user = current_user

    # Add the UserNeed to the identity
    if current_user.is_authenticated:
        identity.provides.add(UserNeed(current_user.id))
        if current_user.is_admin:
            identity.provides.add(admin_role)


@login_manager.user_loader
def load_user(user_id):
    return User.query.filter(User.id==user_id, User.is_active==True).first()


@current_app.route('/join', methods=['GET'])
def join():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = LoginForm()
    signup = SignupForm()
    return render_template('join.html', loginForm=form, signupForm=signup)

@current_app.route('/login', methods=['POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    form = LoginForm()
    if form.validate_on_submit():
        login_user_bundle(form.user)
        return form.redirect('index')
    signup = SignupForm()
    return render_template('join.html', loginForm=form, signupForm=signup)


@current_app.route('/logout')
@login_required
def logout():
    # Remove the user information from the session
    logout_user()

    # Remove session keys set by Flask-Principal
    for key in ('identity.name', 'identity.auth_type'):
        session.pop(key, None)

    # Tell Flask-Principal the user is anonymous
    identity_changed.send(current_app, identity=AnonymousIdentity())
    session_identity_loader()

    return redirect(url_for('index'))


@current_app.route('/signup', methods=['POST'])
def signup():
    """if not conf.SELF_REGISTRATION:
        flash("Self-registration is disabled.", 'warning')
        return redirect(url_for('index'))"""
    if current_user.is_authenticated:
        return redirect(url_for('index'))

    form = SignupForm()
    if form.validate_on_submit():
        user = User(name=form.name.data,
                    email=form.email.data,
                    pwdhash=generate_password_hash(form.password.data),
                    is_active=True)
        db.session.add(user)
        db.session.commit()
        """
        # Send the confirmation email
        try:
            notifications.new_account_notification(user)
        except Exception as error:
            flash(gettext('Problem while sending activation email: %(error)s',
                          error=error), 'danger')
            return redirect(url_for('home'))

        flash(gettext('Your account has been created. '
                      'Check your mail to confirm it.'), 'success')
        """
        flash('Your account has been created. ', 'success')
        login_user_bundle(user) # automatically log the user

        return form.redirect('index')

    loginForm = LoginForm()
    return render_template('join.html', loginForm=loginForm, signupForm=form)
