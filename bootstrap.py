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

from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
import flask.ext.restless

# Create Flask app
app = Flask('web')

# Create a random secrey key so we can use sessions
app.config['SECRET_KEY'] = os.urandom(12)

app.debug = conf.LOG_LEVEL <= logging.DEBUG
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = conf.SQLALCHEMY_DATABASE_URI

db = SQLAlchemy(app)

# Create the Flask-Restless API manager.
manager = flask.ext.restless.APIManager(app, flask_sqlalchemy_db=db)

def populate_g():
    from flask import g
    g.db = db
    g.app = app
