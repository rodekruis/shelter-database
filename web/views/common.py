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

import json
from collections import defaultdict
from functools import wraps
from flask import current_app, Response
from flask_login import login_user
from flask_principal import (Identity, Permission, RoleNeed,
                                 session_identity_loader, identity_changed)
from sqlalchemy import func

#from web.lib.utils import default_handler
from web.models import (Category, Property, Attribute, ShelterPicture,
                        ShelterDocument, Shelter, Section)

admin_role = RoleNeed('admin')
admin_permission = Permission(admin_role)

def jsonify(func):
    """Will cast results of func as a result, and try to extract
    a status_code for the Response object"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        status_code = 200
        result = func(*args, **kwargs)
        if isinstance(result, Response):
            return result
        elif isinstance(result, tuple):
            result, status_code = result
        return Response(json.dumps(result, default=scoped_default_handler()),
                        mimetype='application/json', status=status_code)
    return wrapper


def login_user_bundle(user):
    login_user(user)
    identity_changed.send(current_app, identity=Identity(user.id))
    session_identity_loader()
    # eventually update the last_seen field

def load_shelter_info(shelter_id, section_name):
    shelter = Shelter.query.filter(Shelter.id==shelter_id).first()
    if not shelter:
        raise Exception("No such shelter")

    section = Section.query.filter(
            func.lower(Section.name)==func.lower(section_name.replace('-', ' '))).first()
    if not section:
        raise Exception("No such section")

    categories = defaultdict(list)
    documents = defaultdict(list)
    pictures = defaultdict(list)

    for category in section.categories:

        if category.name == 'Walls & frame':
            superstructure_type = Property.query.filter(
                    Property.shelter_id==shelter.id,
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
                                    Property.shelter_id==shelter.id,
                                    Property.category.has(name=sub_category.name))
                                .join(Attribute)
                                .order_by(Attribute.display_position.asc())
                                )
            pictures[sub_category.name].extend(
                ShelterPicture.query.filter(
                                    ShelterPicture.shelter_id==shelter.id,
                                    ShelterPicture.category_id==sub_category.id)
                                )
            documents[sub_category.name].extend(
                ShelterDocument.query.filter(
                                    ShelterDocument.shelter_id==shelter.id,
                                    ShelterDocument.category_id==sub_category.id)
                                )
    return shelter, section, categories, documents, pictures
