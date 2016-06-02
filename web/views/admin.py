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

from flask import flash, render_template, url_for, current_app

from web.models import Shelter, Page

@current_app.route('/admin/shelters', methods=['GET'])
def shelters():
    shelters = Shelter.query.filter().all()
    return render_template('admin/shelters.html', shelters=shelters)

@current_app.route('/admin/edit_pages', methods=['GET'])
def admin_recommendations():
    language_code = "en"
    return render_template('admin/help_pages.html')
