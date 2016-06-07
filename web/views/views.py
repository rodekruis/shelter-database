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
__version__ = "$Revision: 0.2.1 $"
__date__ = "$Date: 2016/03/30$"
__revision__ = "$Date: 2016/06/07 $"
__copyright__ = "Copyright (c) "
__license__ = ""

import datetime
#import subprocess
from flask import request, flash, render_template, session, url_for, redirect, \
    g, current_app
from flask_login import login_required, current_user

from bootstrap import db
from web.lib.utils import redirect_url

#
# Default errors
#
@current_app.errorhandler(404)
def page_not_found(e):
    return render_template('errors/404.html'), 404

@current_app.errorhandler(405)
def method_not_allowed(e):
    return render_template('errors/405.html'), 405

@current_app.errorhandler(500)
def internal_server_error(e):
    return render_template('errors/500.html'), 500

@current_app.errorhandler(403)
def authentication_failed(e):
    flash('You do not have enough rights.', 'danger')
    return redirect(url_for('join'))

@current_app.errorhandler(401)
def authentication_required(e):
    flash('Authenticated required.', 'info')
    return redirect(url_for('join'))

@current_app.before_request
def before_request():
    g.user = current_user
    if g.user.is_authenticated:
        g.user.last_seen = datetime.datetime.now()
        db.session.commit()

#
# Views.
#
@current_app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@current_app.route('/contributors', methods=['GET'])
def contributors():
    return render_template('contributors.html')

# @current_app.route('/db_initialization', methods=['GET'])
# def db_initialization():
#     cmd = ['./init_db.sh']
#     try:
#         subprocess.Popen(cmd, stdout=subprocess.PIPE)
#         flash('Re-initialization of the database in progress...', 'success')
#     except:
#         flash('An error occured.', 'danger')
#     return redirect(redirect_url())
