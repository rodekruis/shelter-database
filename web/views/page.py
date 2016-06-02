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

from web.lib.utils import redirect_url
from web.models import Page

@current_app.route('/page/<string:page_name>', methods=['GET'])
def recommendations(page_name):
    language_code = "en"
    page = Page.query.filter(Page.name==page_name,
                            Page.language_code==language_code).first()
    if page:
        return render_template('help_pages.html', page=page)
    else:
        return render_template('errors/404.html'), 404
