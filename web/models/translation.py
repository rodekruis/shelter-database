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
__date__ = "$Date: 2016/06/02$"
__revision__ = "$Date: 2016/06/02 $"
__copyright__ = "Copyright (c) "
__license__ = ""

from bootstrap import db

class Translation(db.Model):
    """
    Represent a translation.
    """
    id = db.Column(db.Integer, primary_key=True)
    original = db.Column(db.String(), default='')
    translated = db.Column(db.String(), default='')
    language_code = db.Column(db.String(), default='')
