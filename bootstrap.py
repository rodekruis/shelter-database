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

"""Bootstrap

Required imports and code execution for basic functionning.
"""

import os
import sys
import logging
import conf
import flask_restless
from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy

# Create Flask app
app = Flask('web')

# Create a random secrey key so we can use sessions
app.config['SECRET_KEY'] = "42"#os.urandom(12)

app.debug = conf.LOG_LEVEL <= logging.DEBUG
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = conf.SQLALCHEMY_DATABASE_URI

db = SQLAlchemy(app)

# Create the Flask-Restless API manager.
manager = flask_restless.APIManager(app, flask_sqlalchemy_db=db)

from web.models import Translation
# Jinja filters
from flask_babel import Babel, format_datetime, get_locale
babel = Babel(app)
def translate(original, language_code=''):
    if language_code == '':
        language_code = get_locale().language
    translation = Translation.query.filter(
                            Translation.original==original,
                            Translation.language_code==language_code,
                            ).first()
    if translation:
        return translation.translated
    else:
        return original
app.jinja_env.filters['translate'] = translate
app.jinja_env.filters['datetime'] = format_datetime


# Flask-Admin
from flask_admin import Admin, AdminIndexView
from flask_admin.contrib.sqla import ModelView
from flask_admin.menu import MenuLink
from web.models import Value, User, Shelter
menu_link_back_home = MenuLink(name='Back to dashboard',
                                url='/admin/dashboard')

class TranslationView(ModelView):
    column_searchable_list = ('original', 'translated')
    column_filters = ['language_code']
    column_editable_list = ['translated']

class ValueView(ModelView):
    column_searchable_list = ('name',)
    column_filters = ['attribute_id']

class UserView(ModelView):
    column_exclude_list = ['pwdhash']
    column_editable_list = ['email', 'name']

class ShelterView(ModelView):
    column_exclude_list = ['properties']
    form_excluded_columns = ['properties']

admin = Admin(app,
                name='Management of data',
                template_mode='bootstrap3',
                index_view=AdminIndexView(
                        name='Home',
                        url='/admin/data_management'
                    ))
admin.add_view(UserView(User, db.session))
admin.add_view(ShelterView(Shelter, db.session))
admin.add_view(ValueView(Value, db.session))
admin.add_view(TranslationView(Translation, db.session))
admin.add_link(menu_link_back_home)


def populate_g():
    from flask import g
    g.db = db
    g.app = app
    g.babel = babel
