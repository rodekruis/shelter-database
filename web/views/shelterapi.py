    #! /usr/bin/env python
#-*- coding: utf-8 -*-

# ***** BEGIN LICENSE BLOCK *****

#
#
# ***** END LICENSE BLOCK *****

__author__ = ""
__version__ = ""
__date__ = ""
__revision__ = ""
__copyright__ = ""
__license__ = ""

from flask import Blueprint, jsonify
from collections import defaultdict
from web.models import Shelter, Attribute, Property

api_bp = Blueprint('api for shelter', __name__, url_prefix='/api/v0.1')

def tree():
    return defaultdict(tree)

@api_bp.route('/', methods=['GET'])
def apimessage():
    message = tree()
    message["API version"] = 0.1
    message["Message"] = "This is the development API"
    return jsonify(message)

@api_bp.route('/attributes/<attribute_name>', methods=['GET'])
def getattributes(attribute_name, safetext=False):
    """Returns available values for a given attribute name, separated by semicolons"""
    result= tree()
    
    attributes = Attribute.query.filter(Attribute.name==attribute_name).\
                                first().associated_values
   
    result[attribute_name] = ";".join([attribute.name for attribute in attributes])
    return jsonify(result)

@api_bp.route('/shelters', methods=['GET'])
def allshelters():
    """Returns all shelters and their properties"""
    result = tree()
    shelter_properties = Property.query.all()
    for shelter_property in shelter_properties:
    	result[shelter_property.shelter_id][shelter_property.attribute.name] = shelter_property.get_values_as_string()
    return jsonify(result)

@api_bp.route('/shelters/<int:shelter_id>', methods=['GET'])
def shelters(shelter_id):
    """Returns specific shelter with its properties"""
    result = tree()
    shelter_properties  = Property.query.filter(Property.shelter_id==shelter_id)
    for shelter_property in shelter_properties:
    	result[shelter_property.shelter_id][shelter_property.attribute.name] = shelter_property.get_values_as_string()
    return jsonify(result)

@api_bp.route('/shelters/<attribute_name>', methods=['GET'])
@api_bp.route('/shelters/<attribute_name>/<attribute_value>', methods=['GET'])
def attributes(attribute_name, attribute_value=''):
    """Returns all shelters which match a specific attribute name or attribute name + value"""
    result = tree()
    if not attribute_value:
    	shelter_properties = Property.query.filter(Property.attribute.has(name=attribute_name))
    else:
    	shelter_properties = Property.query.filter(Property.attribute.has(name=attribute_name), Property.values.any(name=attribute_value))
    
    for shelter_property in shelter_properties:
    	result[shelter_property.shelter_id][shelter_property.attribute.name] = shelter_property.get_values_as_string()
   
    return jsonify(result)

#shelter_properties = Property.query.join(Property.category).filter(Property.category.has(name="Identification"))
#for shelter_property in shelter_properties:
#    	result[shelter_property.shelter_id][shelter_property.attribute.name] = shelter_property.get_values_as_string()
#    return jsonify(result)

