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
__date__ = "$Date: 2016/06/06$"
__revision__ = "$Date: 2016/06/06 $"
__copyright__ = "Copyright 2016 Luxembourg Institute of Science and Technology"
__license__ = ""

from flask import Blueprint, flash, render_template, url_for, request, redirect
from flask_login import login_required, current_user

from bootstrap import db
from web.models import User
from web.forms import ProfileForm

user_bp = Blueprint('user_bp', __name__, url_prefix='/user')

@user_bp.route('/profile', methods=['GET', 'POST'])
@login_required
def profile():
    user = User.query.filter(User.id==current_user.id).first()
    form = ProfileForm()
    form.set_languages_choice()

    if request.method == 'POST':
        if form.validate():
            # update user
            form.populate_obj(user)

            """
            if form.password.data and \
                form.password.data == form.password_conf.data:
                user.set_password(form.password.data)
            """

            db.session.commit()

            flash('User successfully updated', 'success')
            return redirect(url_for('user_bp.profile'))
        else:
            return render_template('profile.html', user=user, form=form)

    if request.method == 'GET':
        form = ProfileForm(obj=user)
        form.set_languages_choice()
        return render_template('profile.html', user=user, form=form)

@user_bp.route('/shelters', methods=['GET'])
@login_required
def shelters():
    user = User.query.filter(User.id==current_user.id).first()
    return render_template('shelters.html', shelters=user.shelters)
