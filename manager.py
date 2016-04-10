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

from bootstrap import app, db, populate_g, conf
from flask.ext.script import Manager

import scripts
import web.models

manager = Manager(app)

@manager.command
def uml_graph():
    "UML graph from the models."
    with app.app_context():
        web.models.uml_graph(db)

@manager.command
def db_empty():
    "Will drop the database."
    with app.app_context():
        populate_g()
        web.models.db_empty(db)

@manager.command
def db_create():
    "Will create the database."
    with app.app_context():
        populate_g()
        web.models.db_create(db)

@manager.command
def init_db():
    "Will initialize the database with the attribute for the shelters."
    with app.app_context():
        scripts.init_db()

@manager.command
def init_db():
    "Will import the shelters in the database."
    with app.app_context():
        scripts.populate_shelters()

if __name__ == '__main__':
    manager.run()
