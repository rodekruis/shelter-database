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
	

@api_bp.route('/shelters', methods=['GET'])
def allshelters():
    """Return all shelters and their properties """
    
    result = tree()
    shelter_properties  = Property.query.all()
    attribute_table = Attribute.query.all()
    
    for item in shelter_properties:
    	for y in attribute_table:
    		if y.id == item.attribute_id:
    			result[item.shelter_id][y.name] = item.values[0].name

    return jsonify(result)

@api_bp.route('/shelters/<int:shelter_id>', methods=['GET'])
def ashelters(shelter_id):
    """Return specific shelter with its properties"""
    result = tree()
    shelter_properties  = Property.query.filter(Property.shelter_id==shelter_id)
    attribute_table = Attribute.query.all()
    for item in shelter_properties:
    	print("ping")
    	for y in attribute_table:
    		if y.id == item.attribute_id:
    			result[item.shelter_id][y.name] = item.values[0].name
    
    return jsonify(result)


