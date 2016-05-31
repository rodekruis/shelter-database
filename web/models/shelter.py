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
__date__ = "$Date: 2016/03/30$"
__revision__ = "$Date: 2016/03/30 $"
__copyright__ = "Copyright (c) "
__license__ = ""

from datetime import datetime
from sqlalchemy import desc
from bootstrap import db

from web.models import Value, Property

class Shelter(db.Model):
    """
    Represent a shelter.
    """
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime(), default=datetime.now)

    # relationship
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    properties = db.relationship('Property', backref='shelter', lazy='dynamic',
                                cascade='all, delete-orphan',
                                order_by=desc('Property.id'))


    def get_value_of_attribute(self, attribute_id):
        """
        """
        potential_values = Value.query.filter(
                            Value.attribute_id==attribute_id,
                            Shelter.id==self.id)
        properties = Property.query.filter(
                            Property.shelter_id==self.id,
                            Property.attribute_id==attribute_id)

        for value in potential_values:
            for property_elem in properties:
                if property_elem.shelter_id == self.id:
                    return value


            """if value.attribute_id == attribute_id:
                return value"""

        """for property_elem in self.properties:
            if property_elem.attribute.id == attribute_id:
                return property_elem.values"""


    def __str__(self):
        """
        Required for administrative interface.
        """
        return self.id
