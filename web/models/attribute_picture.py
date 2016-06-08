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
__date__ = "$Date: 2016/06/08 $"
__revision__ = "$Date: 2016/06/08 $"
__copyright__ = "Copyright (c) "
__license__ = ""

from bootstrap import db

class AttributePicture(db.Model):
    """
    Represent a translation.
    """
    id = db.Column(db.Integer, primary_key=True)
    file_name = db.Column(db.String(), default='')
    language_code = db.Column(db.String(), default='')

    # relationship
    attribute_id = db.Column(db.Integer, db.ForeignKey('attribute.id'), nullable=False)
