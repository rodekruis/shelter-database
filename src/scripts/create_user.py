#! /usr/bin/python
#-*- coding:utf-8 -*

import csv
from werkzeug import generate_password_hash

from web.models import User
from bootstrap import db

def create_user(email, name, password):
    user = User(email=email,
                name=name,
                pwdhash=generate_password_hash(password),
                is_active=True)
    db.session.add(user)
    db.session.commit()
