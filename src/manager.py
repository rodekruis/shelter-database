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
__date__ = "$Date: 2016/03/30$"
__revision__ = "$Date: 2016/06/02 $"
__copyright__ = "Copyright (c) "
__license__ = ""

from bootstrap import app, db, populate_g
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand

import conf
import scripts
import web.models
from web.models import User

manager = Manager(app)


Migrate(app, db)
manager = Manager(app)
manager.add_command('db', MigrateCommand)



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
def db_init():
    "Will initialize the database."
    print("Initialization of the database...")
    with app.app_context():
        populate_g()
        web.models.db_init(db)

@manager.command
def init_shelters_structure(csv_file, drawnings_folder):
    "Will initialize the database with the attribute for the shelters."
    print("Importing base structure of shelters from '{}' ...".format(csv_file))
    with app.app_context():
        scripts.init_shelters_structure(csv_file, drawnings_folder)

@manager.command
def create_admin_user():
    "Initializes the administrator of the platform"
    from werkzeug import generate_password_hash
    print("Creation of the admin user...")
    with app.app_context():
        user = web.models.User(email=conf.ADMIN_EMAIL,
                            name=conf.ADMIN_NAME,
                            pwdhash=generate_password_hash(conf.ADMIN_PASSWORD),
                            is_admin=True,
                            is_active=True)
        db.session.add(user)
        db.session.commit()

@manager.command
def set_admin(email):
    "set an admin to existing user by email"
    user = User.query.filter(User.email==email).first()
    if not user:
        print("No such user: " + email)
    else:
        print("Making admin for " + email)
        user.is_admin=True
        db.session.commit()

@manager.command
def create_extra_admin_user(email, name, password):
    "Initializes the administrator of the platform"
    from werkzeug import generate_password_hash
    print("Creation of the admin user...")
    with app.app_context():
        user = web.models.User(email=email,
                            name=name,
                            pwdhash=generate_password_hash(password),
                            is_admin=True,
                            is_active=True)
        db.session.add(user)
        db.session.commit()

@manager.command
def create_user(email, name, password):
    "Initializes a user"
    print("Creation of the user {} ...".format(name))
    with app.app_context():
        scripts.create_user(email, name, password)

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

@manager.command
def import_translation(translation_file, language_code):
    "Import a translation file in the database"
    print("Importing translation file from '{}' ...".format(translation_file))
    with app.app_context():
        scripts.import_translation(translation_file, language_code)

@manager.command
def import_shelters_pictures(folder):
    "Import pictures for shelters"
    print("Importing pictures from '{}' ...".format(folder))
    with app.app_context():
        scripts.import_shelters_pictures(folder)

@manager.command
def import_shelters_documents(folder):
    "Import documents for shelters"
    print("Importing documents from '{}' ...".format(folder))
    with app.app_context():
        scripts.import_shelters_documents(folder)

@manager.command
def create_db_triggers():
    "Creates triggers and trigger functions for tables"
    print("Creating database triggers ...")
    with app.app_context():
        scripts.create_db_triggers()

@manager.command
def create_shelters_thumbnails():
    "Creates thumbnails of the cover pictures of shelters"
    print("Creating shelter picture thumbnails ...")
    with app.app_context():
        scripts.create_shelters_thumbnails()

@manager.command
def export_shelters(dump_file, truncate):
    "Exports shelters as a CSV dump file"
    print("Exporting shelter data ...")
    with app.app_context():
        scripts.export_shelters(dump_file, truncate)

@manager.command
def export_shelters_pictures(dump_dir, foldername):
    "Exports shelters pictures into a directory tree"
    print("Exporting shelter picture directories ...")
    with app.app_context():
        scripts.export_shelters_pictures(dump_dir, foldername)

if __name__ == '__main__':
    manager.run()
