#! /usr/bin/python
#-*- coding:utf-8 -*

from web.models import Page
from bootstrap import db

def init_page(name, html_file, language_code):

    with open(html_file, 'r') as html:

        html_content = html.read()

        page = Page(name=name, content=html_content,
                    language_code=language_code)
        db.session.add(page)
        db.session.commit()
