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
__date__ = "$Date: 2016/03/30 $"
__revision__ = "$Date: 2016/08/07 $"
__copyright__ = "Copyright (c) "
__license__ = ""

from bootstrap import conf, app, populate_g
import os

with app.app_context():
    populate_g()

    # HTML views
    from web import views
    app.register_blueprint(views.user_bp)
    app.register_blueprint(views.shelter_bp)
    app.register_blueprint(views.shelters_bp)
    app.register_blueprint(views.admin_bp)

    # API v0.1
    app.register_blueprint(views.api.blueprint_user)
    app.register_blueprint(views.api.blueprint_shelter)
    app.register_blueprint(views.api.blueprint_shelter_picture)
    app.register_blueprint(views.api.blueprint_section)
    app.register_blueprint(views.api.blueprint_category)
    app.register_blueprint(views.api.blueprint_attribute)
    app.register_blueprint(views.api.blueprint_attribute_picture)
    app.register_blueprint(views.api.blueprint_value)
    app.register_blueprint(views.api.blueprint_property)
    app.register_blueprint(views.api.blueprint_page)
    app.register_blueprint(views.api.blueprint_translation)

    # API v0.1.1
    app.register_blueprint(views.api.api_bp)

    # API v0.2
    app.register_blueprint(views.api.apiv02_bp)


# Watch Templates files for change, In DEBUG MODE
if conf.WEBSERVER_DEBUG:
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    extra_dirs = ['src/web/templates/', ]
    extra_files = []
    for extra_dir in extra_dirs:
        for dirname, dirs, files in os.walk(os.path.join(BASE_DIR, extra_dir)):
            for dir in dirs:
                extra_dirs.append(os.path.join(dirname, dir))
            for filename in files:
                filename = os.path.join(dirname, filename)
                if os.path.isfile(filename):
                    extra_files.append(filename)

if __name__ == "__main__":
    app.run(host=conf.WEBSERVER_HOST,
            port=conf.WEBSERVER_PORT,
            debug=conf.WEBSERVER_DEBUG,
            extra_files=extra_files)
