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
__date__ = "$Date: 2016/06/21 $"
__revision__ = "$Date: 2016/06/21 $"
__copyright__ = "Copyright (c) "
__license__ = ""


from bootstrap import db

class Section(db.Model):
    """
    Represent a section.
    """
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(), default='')

    # relationships
    categories = db.relationship('Category', backref='section', lazy='dynamic',
                           cascade='all, delete-orphan')

    def __str__(self):
        """
        Required for administrative interface.
        """
        return self.name

    def __repr__(self):
        return '<User %r>' % (self.name)
