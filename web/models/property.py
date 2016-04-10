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
    value_id = db.Column(db.Integer, db.ForeignKey('value.id'), nullable=False)
