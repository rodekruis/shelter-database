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


    def __str__(self):
        """
        Required for administrative interface.
        """
        return self.id
