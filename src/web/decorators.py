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
__date__ = "$Date: 2016/07/11 $"
__revision__ = "$Date: 2016/07/11 $"
__copyright__ = "Copyright (c) "
__license__ = ""

from threading import Thread
from functools import wraps

def async(f):
    """
    This decorator enables to launch a task (for examle sending an email or
    indexing the database) in background.
    This prevent the server to freeze.
    """
    def wrapper(*args, **kwargs):
        thr = Thread(target=f, args=args, kwargs=kwargs)
        thr.start()
    return wrapper
    
def docstring_formatter(*sub):
    """
    This decorator inserts variables into the docstring of a python function.
    It works via string formatting e.g str.format(). Therefore the docstrings 
    should contain the "{}" placeholders where the variables will be inserted.
    """
    def dec(obj):
        obj.__doc__ = obj.__doc__.format(*sub)
    return(dec)
    
