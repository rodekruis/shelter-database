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
from sqlalchemy import desc
from bootstrap import db

class Category(db.Model):
    """
    Represent a Categoty.
    """
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(), nullable=False, default='')

    # relationships
    #attributes = db.relationship('Attribute', backref='category', lazy='dynamic',
                           #cascade='all, delete-orphan',
                           #order_by=desc('Attribute.id'))
    section_id = db.Column(db.Integer, db.ForeignKey('section.id'))

    attributes = db.relationship("Attribute", back_populates="category")

    parent_id = db.Column(db.Integer, db.ForeignKey(id))
    sub_categories = db.relationship('Category',
                             backref=db.backref('parent', remote_side=id),
                             lazy="dynamic")

    properties = db.relationship("Property", back_populates="category")
