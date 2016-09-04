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
__date__ = "$Date: 2016/06/08 $"
__revision__ = "$Date: 2016/06/08 $"
__copyright__ = "Copyright 2016 Luxembourg Institute of Science and Technology"
__license__ = ""

from flask_wtf import Form
from flask import url_for, redirect
from wtforms import validators, TextField, SubmitField

from web.models import Category

class AttributeForm(Form):
    """
    Attribute form.
    """
    name = TextField("Name",
        [validators.Required("Please enter a name.")])
    submit = SubmitField("OK")

    def validate(self):
        validated = super(AttributeForm, self).validate()
        return validated
