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
__copyright__ = "Copyright 2016 Luxembourg Institute of Science and Technology"
__license__ = ""

from flask import render_template, current_app
from flask_babel import get_locale

from web.models import Page

@current_app.route('/page/<string:page_name>', methods=['GET'])
def recommendations(page_name):
    language_code = get_locale().language
    page = Page.query.filter(Page.name==page_name,
                            Page.language_code==language_code).first()
    if not page:
        page = Page.query.filter(Page.name==page_name,
                                Page.language_code=='en').first()
        if not page:
            return render_template('errors/404.html'), 404
    return render_template('help_pages.html', page=page)
