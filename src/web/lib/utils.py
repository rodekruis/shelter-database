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
__date__ = "$Date: 2016/03/01$"
__revision__ = "$Date: 2016/03/01 $"
__copyright__ = "Copyright (c) Luxembourg Institute of Science and Technology"
__license__ = ""

from flask import request, url_for, session, flash
import requests
from flask_login import current_user
from web.views.common import admin_role, login_user_bundle
from web.models import User, Shelter, ShelterPicture
from werkzeug import generate_password_hash
import string
import random
from bootstrap import db
from .text import slugify
import conf
import os
from PIL import Image

try:
    from urlparse import urlparse, urljoin
except:
    from urllib.parse import urlparse, urljoin


def is_safe_url(target):
    """
    Ensures that a redirect target will lead to the same server.
    """
    ref_url = urlparse(request.host_url)
    test_url = urlparse(urljoin(request.host_url, target))
    return test_url.scheme in ('http', 'https') and \
        ref_url.netloc == test_url.netloc


def get_redirect_target():
    """
    Looks at various hints to find the redirect target.
    """
    for target in request.args.get('next'), request.referrer:
        if not target:
            continue
        if is_safe_url(target):
            return target


def redirect_url(default='index'):
    return request.args.get('next') or request.referrer or url_for(default)


def allowed_file(filename, allowed_extensions):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in allowed_extensions


def generate_random_password(N):
    return ''.join(random.SystemRandom().choice(
        string.ascii_uppercase + string.digits) for _ in range(N))


class HumanitarianId:
    def __init__(self):
        if "hid_access_token" not in session:
            self.status = False
            return

        access_token = session['hid_access_token']
        r = requests.get(conf.HUMANITARIAN_ID_AUTH_URI+'/account.json',
                         params={'access_token': access_token})
        if r.status_code == 200:
            self.data = r.json()
            if self.data['active'] == 1 and self.data['email_verified']:
                r_profile = requests.get(
                        conf.HUMANITARIAN_ID_PROFILE_URI+'/v0/profile/view',
                        params={'access_token': access_token,
                                'userid': self.data['user_id']})
                self.user_profile = r_profile.json()
                self.status = True
            else:
                self.status = False
        else:
            self.status = False

    def login(self):
        """
        Login with HumanitarianId
        If no HumanitarianId is found in database
            New User is Created
            If HumanitarianId user's email conflicts with
            existing user, than h_id is stored in existing user
            profile
        """
        if current_user.is_authenticated:
            return True
        if self.status:
            # Search for user for obtain h_id
            user = User.query.filter_by(h_id=self.data['id']).first()
            if not user:
                # Search for user for obtain email
                user = User.query.filter_by(email=self.data['email']).first()
                if user:
                    # Integrate user with obtain email with obtain hd_id
                    self.create_user(user)
                    flash('You are logged in with email: '+user.email,
                          'warning')
                else:
                    user = self.create_user()
            # Login user if obtain h_id or email match with user
            login_user_bundle(user)
            flash('You are logged in', 'success')
            return True
        return False

    def create_user(self, user=None):
        """
        Create or Update User
        """
        if user:
            user.h_id = self.data['id']
        else:
            user = User(name=slugify(self.data.get('name')),
                        email=self.data.get('email'),
                        pwdhash=generate_password_hash(
                            generate_random_password(8)),
                        h_id=self.data.get('id'),
                        is_active=True)
            flash('Your account has been created. ', 'success')

        if self.user_profile.get('contacts'):
            for contact in self.user_profile.get('contacts'):
                if contact.get('type') == 'global':
                    user.image = contact.get('image')
                    try:
                        user.organization = contact.get('organization')[0].\
                                get('name')
                    except AttributeError:
                        pass 
                    except IndexError:
                        pass
                    break

        db.session.add(user)
        db.session.commit()
        return user

def create_thumbnail(filename, thumbname, path):
    """
    Create thumbnails for a picture
    """
    try:
        im = Image.open(os.path.join(path, filename))
        im.thumbnail((375,250), Image.BICUBIC)
        im.save(os.path.join(path, thumbname), 'JPEG', quality=70, optimize=True, progressive=True)
    except:
        print("Failed to create thumbnail for {}".format(filename))
        
             
