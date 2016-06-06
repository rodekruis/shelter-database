#! /usr/bin/env python
#-*- coding: utf-8 -*-

# ***** BEGIN LICENSE BLOCK *****
# This file is part of LPS - Abstraction Layer.
# Copyright (c) 2015-2016 Luxembourg Institute of Science and Technology.
# All rights reserved.
#
#
#
# ***** END LICENSE BLOCK *****

__author__ = "Cedric Bonhomme"
__version__ = "$Revision: 0.1 $"
__date__ = "$Date: 2015/12/09$"
__revision__ = "$Date: 2015/12/09 $"
__copyright__ = "Copyright (c) Luxembourg Institute of Science and Technology"
__license__ = ""

""" Program variables.

This file contain the variables used by the application.
"""

import os
import sys
import logging
try:
    import configparser as confparser
except:
    import ConfigParser as confparser

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
PATH = os.path.abspath(".")

# available languages
LANGUAGES = {
    'en': 'English',
    'fr': 'French'
}

TIME_ZONE = {
    "en": "US/Eastern",
    "fr": "Europe/Paris"
}

DEFAULTS = {"platform_url": "http://127.0.0.1:5000",
            "host": "0.0.0.0",
            "port": "5000",
            "https": "false",
            "debug": "true",
            "log_path": "warroom.log",
            "log_level": "info"
            }

config = confparser.SafeConfigParser(defaults=DEFAULTS)
config.read(os.path.join(BASE_DIR, "conf/conf.cfg"))

PLATFORM_URL = config.get('misc', 'platform_url')

SQLALCHEMY_DATABASE_URI = config.get('database', 'database_url')

WEBSERVER_DEBUG = config.getboolean('webserver', 'debug')
WEBSERVER_HOST = config.get('webserver', 'host')
WEBSERVER_PORT = config.getint('webserver', 'port')
WEBSERVER_HTTPS = config.getboolean('webserver', 'https')

LOG_PATH = config.get('misc', 'log_path')
LOG_LEVEL = {'debug': logging.DEBUG,
             'info': logging.INFO,
             'warn': logging.WARN,
             'error': logging.ERROR,
             'fatal': logging.FATAL}[config.get('misc', 'log_level')]
