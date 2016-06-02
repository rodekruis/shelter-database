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
__revision__ = "$Date: 2016/06/02 $"
__copyright__ = "Copyright (c) "
__license__ = ""

from bootstrap import app, db, populate_g, conf
from flask_script import Manager

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
    print("Dropping database...")
    with app.app_context():
        populate_g()
        web.models.db_empty(db)

@manager.command
def db_create():
    "Will create the database."
    print("Creation of the database...")
    with app.app_context():
        populate_g()
        web.models.db_create(db)

@manager.command
def init_db_structure(csv_file):
    "Will initialize the database with the attribute for the shelters."
    print("Importing base structure of shelters from '{}' ...".format(csv_file))
    with app.app_context():
        scripts.init_db(csv_file)

@manager.command
def create_admin_user():
    "Initializes the administrator of the platform"
    from werkzeug import generate_password_hash
    print("Creation of the admin user...")
    with app.app_context():
        user = web.models.User(email="cedric.bonhomme@list.lu",
                            name="admin",
                            pwdhash=generate_password_hash("password"),
                            is_admin=True,
                            is_active=True)
        db.session.add(user)
        db.session.commit()

@manager.command
def import_shelters(shelters_owner, csv_file):
    "Will import the shelters in the database."
    print("Importing shelters from '{}' ...".format(csv_file))
    with app.app_context():
        scripts.populate_shelters(shelters_owner, csv_file)

@manager.command
def import_page(name, html_file, language_code):
    "Import a page (HTML file) in the database"
    print("Importing page from '{}' ...".format(html_file))
    with app.app_context():
        scripts.init_page(name, html_file, language_code)

if __name__ == '__main__':
    manager.run()
