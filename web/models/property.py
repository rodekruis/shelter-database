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
__date__ = "$Date: 2016/04/01$"
__revision__ = "$Date: 2016/04/01 $"
__copyright__ = "Copyright (c) "
__license__ = ""

from sqlalchemy import desc
from bootstrap import db

association_table = db.Table('association', db.metadata,
    db.Column('property_id', db.Integer, db.ForeignKey('property.id')),
    db.Column('value_id', db.Integer, db.ForeignKey('value.id'))
)

class Property(db.Model):
    """
    Represent a property of a shelter.
    """
    id = db.Column(db.Integer, primary_key=True)

    # relationship
    shelter_id = db.Column(db.Integer, db.ForeignKey('shelter.id'),
                            nullable=False)
    attribute_id = db.Column(db.Integer, db.ForeignKey('attribute.id'),
                                nullable=False)
    attribute = db.relationship("Attribute", back_populates="properties")

    category_id = db.Column(db.Integer, db.ForeignKey('category.id'),
                            nullable=False)
    category = db.relationship("Category", back_populates="properties")

    values = db.relationship("Value", secondary=association_table,
                            backref="properties")

    def get_values_as_string(self):
        return ", ".join([value.name for value in self.values])
