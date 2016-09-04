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
__date__ = "$Date: 2016/06/02$"
__revision__ = "$Date: 2016/06/02 $"
__copyright__ = "Copyright (c) "
__license__ = ""

from bootstrap import db

class Page(db.Model):
    """
    Represent a page.
    """
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(), default='')
    content = db.Column(db.String(), default='')
    language_code = db.Column(db.String(), default='')
