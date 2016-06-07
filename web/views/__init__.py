from web.views import views
from web.views.shelter import shelter_bp, shelters_bp
from web.views.page import recommendations
from web.views.user import user_bp
from web.views.admin import admin_bp
from web.views.session_mgmt import *

import conf
from flask import g

@g.babel.localeselector
def get_locale():
     # if a user is logged in, use the locale from the user settings
    user = getattr(g, 'user', None)
    #if user is not None:
        #return user.locale
    # otherwise try to guess the language from the user accept
    # header the browser transmits.  We support de/fr/en in this
    # example.  The best match wins.
    return request.accept_languages.best_match(conf.LANGUAGES.keys())

# @g.babel.timezoneselector
# def get_timezone():
#     user = getattr(g, 'user', None)
#     if user is not None:
#         return user.timezone
