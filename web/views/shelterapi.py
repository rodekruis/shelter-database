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
def getattributes(attribute_name):
    """Returns available values for a given attribute name, separated by semicolons"""
    result= tree()
    
    attributes = Attribute.query.filter(Attribute.name==attribute_name).\
                                first().associated_values
    
    for attribute in attributes:
    	if result[attribute_name]:
    		result[attribute_name] += (";" + attribute.name)
    	else:
    		result[attribute_name] = attribute.name
    		
    return jsonify(result)

@api_bp.route('/shelters', methods=['GET'])
def allshelters():
    """Returns all shelters and their properties"""
    
    result = tree()
    shelter_properties  = Property.query.all()
    attributes = Attribute.query.all()
    
    for shelter_property in shelter_properties:
    	for attribute in attributes:
    		if attribute.id == shelter_property.attribute_id:
    			result[shelter_property.shelter_id][attribute.name] = shelter_property.values[0].name

    return jsonify(result)

@api_bp.route('/shelters/<int:shelter_id>', methods=['GET'])
def shelters(shelter_id):
    """Returns specific shelter with its properties"""
    result = tree()
    shelter_properties  = Property.query.filter(Property.shelter_id==shelter_id)
    attributes = Attribute.query.all()
    for shelter_property in shelter_properties:
    	for attribute in attributes:
    		if attribute.id == shelter_property.attribute_id:
    			result[shelter_property.shelter_id][attribute.name] = shelter_property.values[0].name
    
    return jsonify(result)


#@api_bp.route('/shelters/<attribute_name>/<attribute_value>', methods=['GET'])
#def attributes(attribute_name, attribute_value):
#    """Returns all shelters which match a specific attribute name + value"""
#    shelter_properties = Property.query.filter(Property.attribute.has(name=attribute_name))
#    attributes = Attribute.query.filter(Attribute.values.has(value=attribute_value))
#    
#    return jsonify(result)




