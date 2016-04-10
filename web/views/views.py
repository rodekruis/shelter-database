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

import string
import datetime
import subprocess
from flask import request, flash,render_template, session, url_for, redirect, \
    g, abort, jsonify
from flask.ext.login import LoginManager, login_user, logout_user, \
    login_required, current_user, AnonymousUserMixin

import conf
from bootstrap import app, db
from web.forms import LoginForm
from web.models import User, Shelter

#
# Default errors
#
@app.errorhandler(404)
def page_not_found(e):
    return render_template('errors/404.html'), 404

@app.errorhandler(405)
def method_not_allowed(e):
    return render_template('errors/405.html'), 405

@app.errorhandler(500)
def internal_server_error(e):
    return render_template('errors/500.html'), 500


def redirect_url(default='start'):
    return request.args.get('next') or \
           request.referrer or \
           url_for(default)

login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.login_message = u'Connectez-vous pour acceder à la page.'
login_manager.login_message_category = 'danger'

@app.errorhandler(403)
def authentication_failed(e):
    flash('You do not have enough rights.', 'danger')
    return redirect(url_for('login'))

@app.errorhandler(401)
def authentication_required(e):
    flash('Authenticated required.', 'info')
    return redirect(url_for('login'))

@login_manager.user_loader
def load_user(id):
    # Return an instance of the User model
    return User.query.filter(User.id==id).first()

@app.before_request
def before_request():
    g.user = current_user
    if g.user.is_authenticated:
        g.user.last_seen = datetime.datetime.now()
        db.session.commit()

def log_user(user):
    """
    Effectively log the user and update the identity with Flask-Principal.
    """
    login_user(user)
    g.user = user
    session['id'] = str(user.id)

    # Tell Flask-Principal the identity changed
    #identity_changed.send(current_app._get_current_object(),
                          #identity=Identity(str(user.id)))
#
# Views.
#
@app.route('/login', methods=['GET', 'POST'])
def login():
    loginForm = LoginForm()

    if g.user is not None and g.user.is_authenticated:
        return redirect(url_for('index'))
    else:
        g.user = AnonymousUserMixin()

    if 'id' in session:
        return redirect(url_for('index'))

    if request.method == 'POST':
        if loginForm.validate_on_submit():
            user = User.query.filter(User.name==loginForm.name.data).first()
            if user and user.check_password(loginForm.password.data):
                log_user(user)

                # flash("Logged in successfully.", 'success')
                return loginForm.redirect('start')
            else:
                flash("Invalid e-mail or password", 'error')
                return redirect(redirect_url())
        else:
            return render_template('login.html', loginForm=loginForm, active=0)

    if request.method == 'GET':
        return render_template('login.html', loginForm=loginForm, active=0)

@app.route('/logout')
@login_required
def logout():
    """
    Log out view. Removes the user information from the session.
    """
    session.pop('id', None)

    # Remove the user information from the session
    logout_user()

    # Remove session keys set by Flask-Principal
    for key in ('identity.name', 'identity.auth_type'):
        session.pop(key, None)

    # Tell Flask-Principal the user is anonymous
    #identity_changed.send(current_app._get_current_object(),
                          #identity=AnonymousIdentity())

    flash("Logged out successfully.", 'success')
    return redirect(url_for('login'))


@app.route('/', methods=['GET'])
def start():
    return render_template('index.html')

@app.route('/details/<shelter_id>/<section_name>', methods=['GET'])
def details():
    return render_template('details.html')

@app.route('/edit/<shelter_id>/<section_name>', methods=['GET'])
def edit():
    return render_template('details.html')

@app.route('/dashboard', methods=['GET'])
@login_required
def dashboard():
    return render_template('dashboard.html', user=g.user,
                                users=User.query.all())

@app.route('/dashboard/user/<user_id>', methods=['GET'])
@login_required
def dashboard_user(user_id):
    employee = User.query.filter(User.id == user_id).first()
    return render_template('dashboard_user.html', user=g.user,
                                employee=employee)

@app.route('/db_initialization', methods=['GET'])
def db_initialization():
    cmd = ['./init_db.sh']
    try:
        subprocess.Popen(cmd, stdout=subprocess.PIPE)
        flash('Re-initialization of the database in progress...', 'success')
    except:
        flash('An error occured.', 'danger')
    return redirect(redirect_url())
