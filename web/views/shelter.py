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
from flask import request, flash, render_template, session, url_for, redirect, \
    g, abort, jsonify
from flask_login import login_required, current_user

from sqlalchemy import asc

from bootstrap import app
from web.forms import LoginForm
from web.models import User, Shelter, Property, Attribute, Category



@app.route('/details/<int:shelter_id>/<section_name>', methods=['GET'])
def details(shelter_id=0, section_name=""):
    #shelter = Shelter.query.filter(Shelter.id==shelter_id).first()

    if section_name == "generalInformation":
        categories_list = ["Identification", "Disaster & Response", "Site"]
    elif section_name == "implementationDetails":
        categories_list = ["General"]
    elif section_name == "structure":
        superstructure_type = Property.query.filter(
                            Property.shelter_id==shelter_id,
                            Property.category.has(name="Walls & Frame")).first()
        categories_list = ["Foundation", "Walls & Frame",
                            superstructure_type.get_values(),
                            "Beams & Floor",
                            "Beams & Floor (ground floor)", "Roof"]
    elif section_name == "skin":
        categories_list = ["Cladding", "Openings", "Insulation"]
    elif section_name == "services":
        categories_list = ["Services"]
    elif section_name == "spaceplan":
        categories_list = ["Spaceplan"]
    elif section_name == "documents":
        categories_list = ["Documents"]
    else:
        categories_list = []

    categories = defaultdict(list)
    for category in categories_list:
        categories[category].extend(
            Property.query.filter(
                                Property.shelter_id==shelter_id,
                                Property.category.has(name=category))
                            .join(Attribute)
                            .order_by(Attribute.display_position.asc())
                            )


    return render_template('details.html',
                            section_name=section_name,
                            shelter_id=shelter_id,
                            categories_list=categories_list,
                            categories=categories)


@app.route('/edit/<int:shelter_id>/<section_name>', methods=['GET'])
def edit(shelter_id=0, section_name=""):
    shelter = Shelter.query.filter(Shelter.id==shelter_id).first()

    if section_name == "generalInformation":
        categories_list = ["Identification", "Disaster & Response", "Site"]
    elif section_name == "implementationDetails":
        categories_list = ["General"]
    elif section_name == "structure":
        superstructure_type = Property.query.filter(
                            Property.shelter_id==shelter_id,
                            Property.category.has(name="Walls & Frame")).first()
        categories_list = ["Foundation", "Walls & Frame",
                            superstructure_type.get_values(),
                            "Beams & Floor",
                            "Beams & Floor (ground floor)", "Roof"]
    elif section_name == "skin":
        categories_list = ["Cladding", "Openings", "Insulation"]
    elif section_name == "services":
        categories_list = ["Services"]
    elif section_name == "spaceplan":
        categories_list = ["Spaceplan"]
    elif section_name == "documents":
        categories_list = ["Documents"]
    else:
        categories_list = []


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
