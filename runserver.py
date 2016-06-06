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
__revision__ = "$Date: 2016/06/06 $"
__copyright__ = "Copyright (c) "
__license__ = ""

from bootstrap import conf, app, manager, populate_g
from web import models
#from web import websocketprocessors as processors

with app.app_context():
    populate_g()

    # HTML views
    from web import views
    app.register_blueprint(views.user_bp)
    app.register_blueprint(views.admin_bp)

    # API
    # 'User' Web service
    blueprint_user = manager.create_api_blueprint(models.User,
                        methods=['GET', 'POST', 'PUT', 'DELETE'])
    app.register_blueprint(blueprint_user)

    # 'Shelter' Web service
    blueprint_shelter = manager.create_api_blueprint(models.Shelter,
                        methods=['GET', 'POST', 'PUT', 'DELETE'])
    app.register_blueprint(blueprint_shelter)

    # 'Category' Web service
    blueprint_category = manager.create_api_blueprint(models.Category,
                        methods=['GET', 'POST', 'PUT', 'DELETE'])
    app.register_blueprint(blueprint_category)

    # 'Attribute' Web service
    blueprint_attribute = manager.create_api_blueprint(models.Attribute,
                        methods=['GET', 'POST', 'PUT', 'DELETE'])
    app.register_blueprint(blueprint_attribute)

    # 'Value' Web service
    blueprint_value = manager.create_api_blueprint(models.Value,
                        methods=['GET', 'POST', 'PUT', 'DELETE'])
    app.register_blueprint(blueprint_value)

    # 'Property' Web service
    blueprint_property = manager.create_api_blueprint(models.Property,
                        methods=['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
    app.register_blueprint(blueprint_property)

    # 'Page' Web service
    blueprint_page = manager.create_api_blueprint(models.Page,
                        methods=['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
    app.register_blueprint(blueprint_page)

    # 'Translation' Web service
    blueprint_translation = manager.create_api_blueprint(models.Translation,
                        methods=['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
    app.register_blueprint(blueprint_translation)


if __name__ == "__main__":
    app.run(host=conf.WEBSERVER_HOST,
                    port=conf.WEBSERVER_PORT,
                    debug=conf.WEBSERVER_DEBUG)
