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

from bootstrap import socketio

def post_postprocessor(result=None, **kw):
    socketio.emit('post', result, namespace="/task")

def put_single_postprocessor(result=None, **kw):
    socketio.emit('put', result, namespace="/task")


def activity_post_postprocessor(result=None, **kw):
    socketio.emit('post', result, namespace="/activity")


def zone_post_postprocessor(result=None, **kw):
    socketio.emit('post', result, namespace="/zone")
