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

class Value(db.Model):
    """
    Represent a value of an attribute.
    """
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(), nullable=False)

    # relationship
    attribute_id = db.Column(db.Integer, db.ForeignKey('attribute.id'))

    properties = db.relationship('Property', backref='value', lazy='dynamic',
                                cascade='all, delete-orphan',
                                order_by=desc('Property.id'))
