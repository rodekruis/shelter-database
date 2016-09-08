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

from bootstrap import app, manager

from web import models
from web import processors


# 'User' Web service
blueprint_user = manager.create_api_blueprint(models.User,
                    exclude_columns=['pwdhash'],
                    methods=['GET', 'POST', 'PUT', 'DELETE'],
                    preprocessors=dict(
                            GET_SINGLE=[processors.auth_func],
                            GET_MANY=[processors.auth_func],
                            POST=[processors.auth_func,
                                processors.shelter_POST_preprocessor],
                            DELETE=[processors.auth_func]))


# 'Shelter' Web service
blueprint_shelter = manager.create_api_blueprint(models.Shelter,
                    exclude_columns=['user_id', 'responsible.pwdhash',
                                    'responsible.email'],
                    methods=['GET', 'POST', 'PUT', 'DELETE'],
                    preprocessors=dict(
                            POST=[processors.auth_func,
                                processors.shelter_POST_preprocessor],
                            DELETE=[processors.auth_func]))


# 'ShelterPicture' Web service
blueprint_shelter_picture = manager.create_api_blueprint(models.ShelterPicture,
                    methods=['GET', 'POST', 'PUT', 'DELETE'])


# 'Section' Web service
blueprint_section = manager.create_api_blueprint(models.Section,
                    methods=['GET', 'POST', 'PUT', 'DELETE'])


# 'Category' Web service
blueprint_category = manager.create_api_blueprint(models.Category,
                    methods=['GET', 'POST', 'PUT', 'DELETE'])


# 'Attribute' Web service
blueprint_attribute = manager.create_api_blueprint(models.Attribute,
                    methods=['GET', 'POST', 'PUT', 'DELETE'],
                    results_per_page = 10000000,
                    max_results_per_page = 10000000)


# 'AttributePicture' Web service
blueprint_attribute_picture = manager.create_api_blueprint(models.AttributePicture,
                    methods=['GET', 'POST', 'PUT', 'DELETE'])


# 'Value' Web service
blueprint_value = manager.create_api_blueprint(models.Value,
                    methods=['GET', 'POST', 'PUT', 'DELETE'])


# 'Property' Web service
blueprint_property = manager.create_api_blueprint(models.Property,
                    methods=['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
                    results_per_page = 10000000,
                    max_results_per_page = 10000000,
                    preprocessors=dict(
                            POST=[processors.auth_func,
                                    processors.property_preprocessor],
                            PUT=[processors.auth_func,
                                    processors.property_preprocessor],
                            DELETE=[processors.auth_func]))


# 'Page' Web service
blueprint_page = manager.create_api_blueprint(models.Page,
                    methods=['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])


# 'Translation' Web service
blueprint_translation = manager.create_api_blueprint(models.Translation,
                    methods=['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])
