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

from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
import flask_restless


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

# Jinja filters
from flask_babel import Babel, format_datetime, get_locale
from web.models import Translation
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

class TranslationView(ModelView):
    column_searchable_list = (Translation.original, Translation.translated)

# admin = Admin(app, name='Management of translations', template_mode='bootstrap3')
# admin.add_view(TranslationView(Translation, db.session))


def populate_g():
    from flask import g
    g.db = db
    g.app = app
    g.babel = babel
