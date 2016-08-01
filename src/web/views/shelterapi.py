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

#from bootstrap import db
from bootstrap import db
from sqlalchemy.sql import func
from flask import Blueprint, jsonify, request
from collections import defaultdict
from web.models import Shelter, Attribute, Property, Value, Association

api_bp = Blueprint('api for shelter', __name__, url_prefix='/api/v0.1')

def tree():
    return defaultdict(tree)

def queryfactory(model,join=False,filt=False,value=False):
	
	#helper functions to construct queries
	def filter_or(obj,attrib,val):
		"""Construct filtering method (OR)"""
		list(val)
		if len(val) == 1:
			return obj.filter(attrib == val[0])
		else: 
			return obj.filter(attrib.in_(val))
	
	def filter_and(obj,attrib,val):
		"""Construct filtering methods recursively (AND)"""
		list(val)
		if len(val) == 1:
			return obj.filter(attrib == val[0])
		else: 
			return filter_and(obj.filter(attrib == val[len(val)-1]),attrib, val[0:len(val)-1])

#subquery = queryfactory(Property,Attribute,Attribute.name,attr)

	if join and not filt:
		return model.query.join(join)
	elif filt and join:
		return filter_or(model.query.join(join),filt,value)
	elif filt and not join:
		return filter_or(model.in_(value))
	else:
		return "error"

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
    
    attributes = Attribute.query.filter(Attribute.uniqueid==attribute_name).\
                                first().associated_values
   
    result[attribute_name] = ";".join([attribute.name for attribute in attributes])
    return jsonify(result)

@api_bp.route('/shelters', methods=['GET'])
def allshelters():
    """Returns all shelters and their properties"""
    result = tree()
    
    ## attribute parameter listening
    if request.args.getlist('attribute'):
    	attr = request.args.getlist('attribute')
    
    	subquery = queryfactory(Property,Attribute,Attribute.uniqueid,attr).subquery()
    	shelter_properties = Property.query.filter(Property.shelter_id==subquery.c.shelter_id).all()
    else:
    	shelter_properties = db.session.query(Property.shelter_id,Attribute.name,func.string_agg(Value.name,"';'").label("value"))\
    		.join(Attribute)\
    		.join(Association,Property.id==Association.property_id)\
    		.join(Value, Association.value_id==Value.id)\
    		.group_by(Property.shelter_id, Attribute.name)
    	print(shelter_properties)
    
    ## value parameter listening
    if request.args.getlist('attribute') and request.args.getlist('value'):
    	valu = request.args.getlist('value')
    
    	subquery = Property.query.filter(Property.attribute.has(Attribute.uniqueid.in_(attr)), Property.values.any(Value.name.in_(valu))).subquery()
    	shelter_properties = Property.query.filter(Property.shelter_id==subquery.c.shelter_id).all()

    ## format parameter listening and populate defaultict	
    if request.args.get('format') == 'prettytext':
    	for shelter_property in shelter_properties:
    		result[shelter_property.shelter_id][shelter_property.attribute.name] = shelter_property.get_values_as_string()
    else:
    	for shelter_property in shelter_properties:
    		result[shelter_property.shelter_id][shelter_property.name] = shelter_property.value
    return jsonify(result)


@api_bp.route('/shelters/<int:shelter_id>', methods=['GET'])
def shelters(shelter_id):
    """Returns specific shelter with its properties"""
    result = tree()
    shelter_properties  = Property.query.filter(Property.shelter_id==shelter_id)
    for shelter_property in shelter_properties:
    	result[shelter_property.shelter_id][shelter_property.attribute.uniqueid] = shelter_property.get_values_as_string()
    
    return jsonify(result)

@api_bp.route('/shelters/<attribute_name>', methods=['GET'])
@api_bp.route('/shelters/<attribute_name>/<attribute_value>', methods=['GET'])
def attributes(attribute_name, attribute_value=''):
    """Returns all shelters which match a specific attribute name or attribute name + value"""
    result = tree()
    if not attribute_value:
    	shelter_properties = Property.query.filter(Property.attribute.has(uniqueid=attribute_name))
    else:
    	shelter_properties = Property.query.filter(Property.attribute.has(uniqueid=attribute_name), Property.values.any(name=attribute_value))
    
    for shelter_property in shelter_properties:
    	result[shelter_property.shelter_id][shelter_property.attribute.uniqueid] = shelter_property.get_values_as_string()
   
    return jsonify(result)

#shelter_properties = Property.query.join(Property.category).filter(Property.category.has(name="Identification"))
#for shelter_property in shelter_properties:
#    	result[shelter_property.shelter_id][shelter_property.attribute.name] = shelter_property.get_values_as_string()
#    return jsonify(result)

