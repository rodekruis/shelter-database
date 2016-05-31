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

from bootstrap import conf, app, manager
from web import models
#from web import websocketprocessors as processors

with app.app_context():
    # Views to render the HTML files
    from web import views

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
                        methods=['GET', 'POST', 'PUT', 'DELETE'])
    app.register_blueprint(blueprint_property)


if __name__ == "__main__":
    app.run(host=conf.WEBSERVER_HOST,
                    port=conf.WEBSERVER_PORT,
                    debug=conf.WEBSERVER_DEBUG)
