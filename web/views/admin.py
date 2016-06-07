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
__date__ = "$Date: 2016/06/02$"
__revision__ = "$Date: 2016/06/02 $"
__copyright__ = "Copyright (c) "
__license__ = ""

from flask import Blueprint, flash, render_template, current_app, redirect, \
                    url_for
from flask_login import login_required, current_user

from bootstrap import db
from web.views.common import admin_permission
from web.lib.utils import redirect_url
from web.models import Shelter, Page, User

admin_bp = Blueprint('administration', __name__, url_prefix='/admin')

@admin_bp.route('/dashboard', methods=['GET', 'POST'])
@login_required
@admin_permission.require(http_exception=403)
def dashboard():
    return render_template('admin/dashboard.html')

@admin_bp.route('/shelters', methods=['GET', 'POST'])
@login_required
@admin_permission.require(http_exception=403)
def shelters():
    shelters = Shelter.query.filter().all()
    return render_template('admin/shelters.html', shelters=shelters)

@admin_bp.route('/pages', methods=['GET', 'POST'])
@login_required
@admin_permission.require(http_exception=403)
def pages():
    language_code = "en"
    return render_template('admin/help_pages.html')

@admin_bp.route('/users', methods=['GET', 'POST'])
@login_required
@admin_permission.require(http_exception=403)
def users():
    users = User.query.filter().all()
    return render_template('admin/users.html', users=users)

@admin_bp.route('/delete_user/<int:user_id>', methods=['GET'])
@login_required
@admin_permission.require(http_exception=403)
def delete_user(user_id=None):
    """
    Delete a user (with all its data).
    """
    user = User.query.filter(User.id==user_id).first()
    db.session.delete(user)
    db.session.commit()
    return redirect(redirect_url())

@admin_bp.route('/toggle_user/<int:user_id>', methods=['GET'])
@login_required
@admin_permission.require(http_exception=403)
def toggle_user(user_id=None):
    """
    Enable or disable the account of a user.
    """
    user = User.query.filter(User.id==user_id).first()
    user.is_active = not user.is_active
    db.session.commit()
    return redirect(url_for('administration.users'))
