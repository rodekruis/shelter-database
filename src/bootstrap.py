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
__version__ = "$Revision: 0.4 $"
__date__ = "$Date: 2016/03/30$"
__revision__ = "$Date: 2016/06/09 $"
__copyright__ = "Copyright (c) "
__license__ = ""

"""Bootstrap

Required imports and code execution for basic functionning.
"""

import os
import logging
import conf
import flask_restless
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_assets import Environment, Bundle

# Create Flask app

app = Flask('web')

assets = Environment(app)


# Create a random secrey key so we can use sessions
if conf.WEBSERVER_SECRET_KEY:
    app.config['SECRET_KEY'] = conf.WEBSERVER_SECRET_KEY
else:
    app.config['SECRET_KEY'] = os.urandom(12)

app.debug = conf.LOG_LEVEL <= logging.DEBUG

app.config['ASSETS_DEBUG'] = "merge"



app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = conf.SQLALCHEMY_DATABASE_URI

app.config['PUBLIC_PATH'] = conf.PUBLIC_PATH

app.config['JSON_AS_ASCII'] = False

db = SQLAlchemy(app)

# Set up thumbnail handling
app.config['MEDIA_FOLDER'] = conf.SHELTERS_PICTURES_SERVER_PATH
app.config['MEDIA_URL'] = conf.SHELTERS_PICTURES_SITE_PATH


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

def populate_g():
    from flask import g
    g.db = db
    g.app = app
    g.babel = babel
