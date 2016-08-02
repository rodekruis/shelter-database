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
__version__ = "$Revision: 0.2.1 $"
__date__ = "$Date: 2016/03/30$"
__revision__ = "$Date: 2016/06/07 $"
__copyright__ = "Copyright 2016 Luxembourg Institute of Science and Technology"
__license__ = ""

from collections import defaultdict
from flask import request, flash, render_template, url_for, \
                    redirect, current_app, send_from_directory, jsonify
from flask_login import current_user

import conf
from bootstrap import db
from web.models import Shelter, Attribute, Property

def tree():
    return defaultdict(tree)

#
# Default errors
#
@current_app.errorhandler(404)
def page_not_found(e):
    return render_template('errors/404.html'), 404

@current_app.errorhandler(405)
def method_not_allowed(e):
    return render_template('errors/405.html'), 405

@current_app.errorhandler(500)
def internal_server_error(e):
    return render_template('errors/500.html'), 500

@current_app.errorhandler(403)
def authentication_failed(e):
    flash('You do not have enough rights.', 'danger')
    return redirect(url_for('join'))

@current_app.errorhandler(401)
def authentication_required(e):
    flash('Authenticated required.', 'info')
    return redirect(url_for('join'))

#
# Views.
#
@current_app.route('/', methods=['GET'])
def index():
    return render_template('index.html')
	
@current_app.route('/map', methods=['GET'])
def map():
    """
    This view displays the map.
    """
    climate_zones = Attribute.query.filter(Attribute.name=="Climate zone").\
                                first().associated_values
    zones = Attribute.query.filter(Attribute.name=="Zone").\
                                first().associated_values
    disasters = Attribute.query.filter(
                    Attribute.name=="Associated disaster / Immediate cause").\
                                first().associated_values
    materials = Attribute.query.filter(
                    Attribute.name=="Foundation material").\
                                first().associated_values
    return render_template('map.html',
                            geoserver_url = conf.GEOSERVER_URL,
                            climate_zones=climate_zones,
                            zones=zones,
                            disasters=disasters,
                            materials=materials)

@current_app.route('/shelters_for_map', methods=['GET'])
def shelters_for_map():
    result = tree()

    latitude_properties = Property.query.filter(
                            Property.attribute.has(name="GPS Latitude"),
                            )
    longitude_properties = Property.query.filter(
                            Property.attribute.has(name="GPS Longitude"),
                            )
    if not current_user.is_authenticated:
        latitude_properties = latitude_properties.filter(
                                Property.shelter.has(is_published = True))
        longitude_properties = longitude_properties.filter(
                                Property.shelter.has(is_published = True))

    for latitude_property in latitude_properties:
        result[latitude_property.shelter_id]["latitude"] = latitude_property.values[0].name
    for longitude_property in longitude_properties:
        result[longitude_property.shelter_id]["longitude"] = longitude_property.values[0].name

    if request.args:
        result_copy = result.copy()
        for shelter_id in result_copy:
            shelter = Shelter.query.filter(Shelter.id==shelter_id).first()

            for attribute_name, value in request.args.items():
                if not value:
                    continue

                values = [current_value.name for current_value in \
                    shelter.get_values_of_attribute(attribute_name=attribute_name)]

                if value not in values:
                    result.pop(shelter_id, None)
                    break

    for shelter_id in result:
        shelter = Shelter.query.filter(Shelter.id==shelter_id).first()
        result[shelter_id]["name"] = \
            shelter.get_values_of_attribute(attribute_name="Name of shelter")[0].name
        result[shelter_id]["city"] = \
            shelter.get_values_of_attribute(attribute_name="City / Village")[0].name
        result[shelter_id]["id"] = \
            shelter.get_values_of_attribute(attribute_name="ID")[0].name
        result[shelter_id]["isCommercial"] = shelter.is_commercial

    return jsonify(result)


@current_app.route('/dashboard', methods=['GET'])
def dashboard():
    # return render_template('dashboard0.html')
    return render_template('dashboard.html')

@current_app.route('/shelters', methods=['GET'])
def shelters():
    shelters = Shelter.query.filter(Shelter.is_published==True).all()
    return render_template('shelters.html', shelters=shelters)

@current_app.route('/stats', methods=['GET'])
def stats():
    return render_template('stats.html')

@current_app.route('/knowledgebase', methods=['GET'])
def knowledgebase():
    return render_template('knowledgebase.html')
	
@current_app.route('/contribute', methods=['GET'])
def contribute():
    """
    List of contributors.
    """
    return render_template('contribute.html')

@current_app.route('/contributors', methods=['GET'])
def contributors():
    """
    List of contributors.
    """
    return render_template('contributors.html')

@current_app.route('/public/<path:filename>', methods=['GET'])
def public_file(filename):
    """
    Exposes public files (media uploaded by users, etc.).
    """
    return send_from_directory(current_app.config['PUBLIC_PATH'], filename)
