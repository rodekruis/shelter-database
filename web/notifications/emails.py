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

import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

#from postmark import PMMail

import conf
from web.decorators import async

logger = logging.getLogger(__name__)

def send(*args, **kwargs):
    """
    This functions enables to send email through Postmark
    or a SMTP server.
    """
    if conf.POSTMARK:
        send_postmark(**kwargs)
    else:
        send_smtp(**kwargs)

@async
def send_smtp(to="", bcc="", subject="", plaintext=""):
    """
    Send an email.
    """
    # Create message container - the correct MIME type is multipart/alternative.
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = conf.NOTIFICATION_EMAIL
    msg['To'] = to
    if bcc != "":
        msg['BCC'] = bcc

    # Record the MIME type of text/plain.
    part1 = MIMEText(plaintext, 'plain', 'utf-8')

    # Attach parts into message container.
    # According to RFC 2046, the last part of a multipart message, in this case
    # the HTML message, is best and preferred.
    msg.attach(part1)

    with smtplib.SMTP(host=conf.NOTIFICATION_HOST,
                      port=conf.NOTIFICATION_PORT) as smtp:
        smtp.ehlo()
        if conf.NOTIFICATION_STARTTLS:
            smtp.starttls()
        smtp.ehlo()
        if conf.NOTIFICATION_PASSWORD != "":
            smtp.login(conf.NOTIFICATION_USERNAME, conf.NOTIFICATION_PASSWORD)
        smtp.sendmail(conf.NOTIFICATION_EMAIL, [msg['To']], msg.as_string())


def send_postmark(to="", bcc="", subject="", plaintext=""):
    """
    Send an email via Postmark. Used when the application is deployed on
    Heroku.
    """
    try:
        message = PMMail(api_key = conf.POSTMARK_API_KEY,
                        subject = subject,
                        sender = conf.NOTIFICATION_EMAIL,
                        text_body = plaintext)
        message.to = to
        if bcc != "":
            message.bcc = bcc
        message.send()
    except Exception as e:
        logger.exception("send_postmark raised:")
        raise e
