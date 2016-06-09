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
__date__ = "$Date: 2016/05/31$"
__revision__ = "$Date: 2016/05/31 $"
__copyright__ = "Copyright (c) "
__license__ = ""

import datetime
import subprocess
from collections import defaultdict
from flask import Blueprint, request, flash, render_template, \
                    session, url_for, redirect, g, abort, jsonify
from flask_login import login_required, current_user

from sqlalchemy import asc

from bootstrap import app
from web.lib.utils import redirect_url
from web.forms import LoginForm
from web.models import User, Shelter, Property, Attribute, Category, Value, \
                        ShelterPicture


from collections import defaultdict

shelter_bp = Blueprint('shelter_bp', __name__, url_prefix='/shelter')
shelters_bp = Blueprint('shelters', __name__, url_prefix='/shelters')

def tree():
    return defaultdict(tree)

@shelter_bp.route('/shelters_for_map', methods=['GET'])
def shelters_for_map():

    result = tree()


    latitude_properties = Property.query.filter(
                            Property.attribute.has(name="GPS Latitude"),
                            )
    longitude_properties = Property.query.filter(
                            Property.attribute.has(name="GPS Longitude"),
                            )
    # name_properties = Property.query.filter(
    #                         Property.attribute.has(name="Name of shelter"),
    #                         )
    # city_properties = Property.query.filter(
    #                         Property.attribute.has(name="City / Village"),
    #                         )

    for latitude_property in latitude_properties:
        result[latitude_property.shelter_id]["latitude"] = latitude_property.values[0].name
    for longitude_property in longitude_properties:
        result[longitude_property.shelter_id]["longitude"] = longitude_property.values[0].name
    # for name_property in name_properties:
    #     result[name_property.shelter_id]["name"] = name_property.values[0].name
    # for city_property in city_properties:
    #     result[city_property.shelter_id]["city"] = city_property.values[0].name


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


    return jsonify(result)



@shelter_bp.route('/<int:shelter_id>/<section_name>', methods=['GET'])
def details(shelter_id=0, section_name=""):
    shelter = Shelter.query.filter(Shelter.id==shelter_id).first()
    if not shelter:
        flash("No such shelter", "warning")
        return redirect(redirect_url())

    if section_name == "generalInformation":
        categories_list = ["Identification", "Disaster & Response", "Site"]
    elif section_name == "implementationDetails":
        categories_list = ["General"]
    elif section_name == "structure":
        superstructure_type = Property.query.filter(
                            Property.shelter_id==shelter_id,
                            Property.category.has(name="Walls & Frame")).first()
        categories_list = ["Foundation", "Walls & Frame",
                            superstructure_type.get_values_as_string(),
                            "Beams & Floor",
                            "Beams & Floor (ground floor)", "Roof"]
    elif section_name == "skin":
        categories_list = ["Cladding", "Openings", "Insulation"]
    elif section_name == "services":
        categories_list = ["Services"]
    elif section_name == "spacePlan":
        categories_list = ["Spaceplan"]
    elif section_name == "documents":
        categories_list = ["Documents"]
    else:
        flash("No such section", "warning")
        return redirect(redirect_url())

    pictures = defaultdict(list)
    categories = defaultdict(list)
    for category in categories_list:
        category_obj = Category.query.filter(Category.name==category,
                                            Category.parent_id!=None).first()

        categories[category].extend(
            Property.query.filter(
                                Property.shelter_id==shelter_id,
                                Property.category.has(name=category))
                            .join(Attribute)
                            .order_by(Attribute.display_position.asc())
                            )

        pictures[category].extend(
            ShelterPicture.query.filter(
                                ShelterPicture.shelter_id==shelter_id,
                                ShelterPicture.category_id==category_obj.id)
                            )
    print(pictures)


    return render_template('details.html',
                            section_name=section_name,
                            shelter_id=shelter_id,
                            categories_list=categories_list,
                            categories=categories,
                            pictures=pictures)


@shelter_bp.route('/edit/<int:shelter_id>/<section_name>', methods=['GET'])
@login_required
def edit(shelter_id=0, section_name=""):
    shelter = Shelter.query.filter(Shelter.id==shelter_id).first()
    if not shelter:
        flash("No such shelter", "warning")
        return redirect(redirect_url())

    if section_name == "generalInformation":
        categories_list = ["Identification", "Disaster & Response", "Site"]
    elif section_name == "implementationDetails":
        categories_list = ["General"]
    elif section_name == "structure":
        superstructure_type = Property.query.filter(
                            Property.shelter_id==shelter_id,
                            Property.category.has(name="Walls & Frame")).first()
        categories_list = ["Foundation", "Walls & Frame",
                            superstructure_type.get_values_as_string(),
                            "Beams & Floor",
                            "Beams & Floor (ground floor)", "Roof"]
    elif section_name == "skin":
        categories_list = ["Cladding", "Openings", "Insulation"]
    elif section_name == "services":
        categories_list = ["Services"]
    elif section_name == "spacePlan":
        categories_list = ["Spaceplan"]
    elif section_name == "documents":
        categories_list = ["Documents"]
    else:
        flash("No such section", "warning")
        return redirect(redirect_url())


    categories = defaultdict(list)
    for category in categories_list:
        categories[category].extend(
                        Category.query.filter(Category.name==category,
                                                Category.parent_id!=None)
                                                )



    return render_template('edit.html',
                            section_name=section_name,
                            shelter=shelter,
                            shelter_id=shelter_id,
                            categories_list=categories_list,
                            categories=categories)
