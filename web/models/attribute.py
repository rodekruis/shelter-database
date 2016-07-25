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
__version__ = "$Revision: 0.1 $"
__date__ = "$Date: 2016/03/30$"
__revision__ = "$Date: 2016/03/30 $"
__copyright__ = "Copyright (c) "
__license__ = ""

import datetime
from sqlalchemy import asc
from bootstrap import db

from web.models import Value

class Attribute(db.Model):
    """
    Represent an attribute.
    """
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(), nullable=False)
    uniqueid = db.Column(db.String(), nullable=False)
    multiple = db.Column(db.Boolean(), default=True)
    free_text = db.Column(db.Boolean(), default=False)
    is_editable = db.Column(db.Boolean(), default=True)
    is_mandatory = db.Column(db.Boolean(), default=False)
    user_can_add_values = db.Column(db.Boolean(), default=False)
    type = db.Column(db.String(), default='')
    display_position = db.Column(db.Integer, default=0)

    # relationships
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    category = db.relationship("Category", back_populates="attributes")

    associated_values = db.relationship('Value', backref='attribute', lazy='dynamic',
                           cascade='all, delete-orphan',
                           order_by=asc(Value.name))

    properties = db.relationship("Property", back_populates="attribute")

    pictures = db.relationship('AttributePicture', backref='attribute', lazy='dynamic',
                           cascade='all, delete-orphan')

    def __str__(self):
        """
        Required for administrative interface.
        """
        return self.name
