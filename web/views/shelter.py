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
__version__ = "$Revision: 0.7 $"
__date__ = "$Date: 2016/05/31$"
__revision__ = "$Date: 2016/06/09 $"
__copyright__ = "Copyright 2016 Luxembourg Institute of Science and Technology"
__license__ = ""

import os
import datetime
import subprocess
from collections import defaultdict
from werkzeug.utils import secure_filename
from flask import Blueprint, request, flash, render_template, current_app, \
                    session, url_for, redirect, g, abort, jsonify, make_response
from flask_login import login_required, current_user

from sqlalchemy import asc, func

import conf
from bootstrap import app, db
from web.lib.utils import redirect_url, allowed_file
from web.lib.misc_utils import create_pdf
from web.forms import LoginForm
from web.models import User, Shelter, Property, Attribute, Category, Value, \
                        ShelterPicture, Section


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


@shelter_bp.route('/<int:shelter_id>/<section_name>', methods=['GET'])
@shelter_bp.route('/<int:shelter_id>/<section_name>/<to_pdf>', methods=['GET'])
def details(shelter_id=0, section_name="", to_pdf=None):
    shelter = Shelter.query.filter(Shelter.id==shelter_id).first()
    sections = Section.query.filter()

    section = Section.query.filter(
            func.lower(Section.name)==func.lower(section_name.replace('-', ' '))).first()
    if not section:
        flash("No such section", "warning")
        return redirect(redirect_url())

    pictures = defaultdict(list)
    categories = defaultdict(list)
    for category in section.categories:

        if category.name == 'Walls & frame':
            superstructure_type = Property.query.filter(
                    Property.shelter_id==shelter_id,
                    Property.category.has(name="Walls & Frame"),
                    Property.category.has(Category.parent_id!=None)).first()
            if superstructure_type:
                superstructure_type_string = superstructure_type.get_values_as_string()
            else:
                superstructure_type_string = ""
        else:
            superstructure_type_string = ""

        for sub_category in category.sub_categories:
            if category.name == 'Walls & frame' and \
                sub_category.name != 'Walls & Frame' and \
                superstructure_type_string.lower()!=sub_category.name.lower():
                continue

            categories[sub_category.name].extend(
                Property.query.filter(
                                    Property.shelter_id==shelter_id,
                                    Property.category.has(name=sub_category.name))
                                .join(Attribute)
                                .order_by(Attribute.display_position.asc())
                                )
            pictures[sub_category.name].extend(
                ShelterPicture.query.filter(
                                    ShelterPicture.shelter_id==shelter_id,
                                    ShelterPicture.category_id==sub_category.id)
                                )

    if to_pdf == "to_pdf":
        try:
            pdf_file = create_pdf(render_template('pdf/template1.html',
                                            shelter=shelter,
                                            section=section,
                                            section_name=section_name,
                                            shelter_id=shelter_id,
                                            categories=categories,
                                            pictures=pictures))
            response = make_response(pdf_file)
            response.headers['Content-Type'] = 'application/pdf'
            response.headers['Content-Disposition'] = \
                'attachment; filename=%s.pdf' % 'shelter'
            return response
        except Exception as e:
            print(e)
            flash('Error when generating PDF file.', 'danger')

    return render_template('details.html', section_name=section_name,
                            shelter_id=shelter_id, categories=categories,
                            pictures=pictures, sections=sections,
                            section=section)


@shelter_bp.route('/edit/<int:shelter_id>/<section_name>', methods=['GET'])
@login_required
def edit(shelter_id=0, section_name=""):
    shelter = Shelter.query.filter(Shelter.id==shelter_id).first()
    sections = Section.query.filter()

    section = Section.query.filter(
            func.lower(Section.name)==func.lower(section_name.replace('-', ' '))).first()
    if not section:
        flash("No such section", "warning")
        return redirect(redirect_url())

    pictures = defaultdict(list)
    categories = defaultdict(list)
    for category in section.categories:

        if category.name == 'Walls & frame':
            superstructure_type = Property.query.filter(
                    Property.shelter_id==shelter_id,
                    Property.category.has(name="Walls & Frame"),
                    Property.category.has(Category.parent_id!=None)).first()
            if superstructure_type:
                superstructure_type_string = superstructure_type.get_values_as_string()
            else:
                superstructure_type_string = ""
        else:
            superstructure_type_string = ""

        for sub_category in category.sub_categories:
            if category.name == 'Walls & frame' and \
                sub_category.name != 'Walls & Frame' and \
                superstructure_type_string.lower()!=sub_category.name.lower():
                continue

            categories[sub_category.name].extend(
                Property.query.filter(
                                    Property.shelter_id==shelter_id,
                                    Property.category.has(name=sub_category.name))
                                .join(Attribute)
                                .order_by(Attribute.display_position.asc())
                                )
            pictures[sub_category.name].extend(
                ShelterPicture.query.filter(
                                    ShelterPicture.shelter_id==shelter_id,
                                    ShelterPicture.category_id==sub_category.id)
                                )

    return render_template('edit.html', section_name=section_name,
                            shelter=shelter, shelter_id=shelter_id,
                            categories=categories, pictures=pictures,
                            sections=sections, section=section)


@shelter_bp.route('/edit/<int:shelter_id>/<section_name>', methods=['POST'])
@login_required
def get_media(shelter_id=0, section_name=""):
    shelter = Shelter.query.filter(Shelter.id==shelter_id).first()
    if not shelter:
        flash("No such shelter", "warning")
        return redirect(redirect_url())

    file = request.files.get('imagefile', None)
    if file and file.filename == '':
        flash('No selected file', 'warning')
        return redirect(request.url)
    if file and allowed_file(file.filename, conf.ALLOWED_EXTENSIONS_PICTURE):
        path = os.path.join(conf.SHELTERS_PICTURES_PATH, str(shelter.id))
        if not os.path.exists(path):
            os.makedirs(path)
        filename = secure_filename(file.filename)
        file.save(os.path.join(path , filename))

        category_id = request.form['category_id']
        if category_id:
            new_picture = ShelterPicture(file_name=filename,
                    shelter_id=shelter.id, category_id=category_id)
            db.session.add(new_picture)
            db.session.commit()

    return redirect(request.url)


@shelter_bp.route('/delete_picture/<int:picture_id>', methods=['GET'])
@login_required
def delete_picture(picture_id=None):
    picture = ShelterPicture.query.filter(ShelterPicture.id==picture_id).first()
    if picture:
        os.unlink(os.path.join(conf.SHELTERS_PICTURES_PATH,
                                str(picture.shelter_id),
                                str(picture.file_name)))
        db.session.delete(picture)
        db.session.commit()

    return redirect(url_for('shelter_bp.edit', shelter_id=picture.shelter_id,
                                section_name="generalInformation"))
