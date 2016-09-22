#! /usr/bin/env python
# -*- coding: utf-8 -*-

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
__date__ = "$Date: 2016/06/01$"
__revision__ = "$Date: 2016/06/10 $"
__copyright__ = "Copyright (c) Luxembourg Institute of Science and Technology"
__license__ = ""

import sys
import subprocess

try:
    from weasyprint import HTML
except Exception as e:
    print("Problem with weasyprint: {}".format(e))

import conf

def launch_background_process(parameters=[]):
    """
    Fetch the feeds in a new processus.
    The "asyncio" crawler is launched with the manager.
    """
    cmd = [sys.executable, conf.BASE_DIR + '/manager.py']
    cmd.extend(parameters)
    return subprocess.Popen(cmd, stdout=subprocess.PIPE)

def create_pdf(html_code):
    """
    """
    pdf_file = HTML(string=html_code,
                    base_url=conf.SHELTERS_PICTURES_SERVER_PATH).write_pdf()
    return pdf_file
