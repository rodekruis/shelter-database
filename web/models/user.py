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

import re
from datetime import datetime
from werkzeug import generate_password_hash, check_password_hash
from flask_login import UserMixin
from sqlalchemy import desc

from bootstrap import db

class User(db.Model, UserMixin):
    """
    Represent a user.
    """
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(), unique=True, nullable=False)
    name = db.Column(db.String(), default='')
    pwdhash = db.Column(db.String(), nullable=False)
    created_at = db.Column(db.DateTime(), default=datetime.now)
    last_seen = db.Column(db.DateTime(), default=datetime.now)
    is_admin = db.Column(db.Boolean(), default=False)
    is_active = db.Column(db.Boolean(), default=False)

    # relationships
    shelters = db.relationship('Shelter', backref='responsible', lazy='dynamic',
                           cascade='all, delete-orphan',
                           order_by=desc('Shelter.id'))

    @staticmethod
    def make_valid_name(name):
        return re.sub('[^a-zA-Z0-9_\.]', '', name)

    def get_id(self):
        """
        Return the id of the user.
        """
        return self.id

    def set_password(self, password):
        """
        Hash the password of the user.
        """
        self.pwdhash = generate_password_hash(password)

    def check_password(self, password):
        """
        Check the password of the user.
        """
        return check_password_hash(self.pwdhash, password)

    # def __eq__(self, other):
    #     return self.id == other.id

    def __str__(self):
        """
        Required for administrative interface.
        """
        return self.name

    def __repr__(self):
        return '<User %r>' % (self.name)
