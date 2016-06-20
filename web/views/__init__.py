from web.views.shelter import shelter_bp, shelters_bp
from web.views.user import user_bp
from web.views.administration import admin_bp
from web.views import views
from web.views.page import recommendations
from web.views.admin import *
from web.views.session_mgmt import *

import conf
from flask import g
from flask_login import current_user

@g.babel.localeselector
def get_locale():
     # if a user is logged in, use the locale from the user settings
    user = getattr(g, 'user', None)
    if user is not None and current_user.is_authenticated:
        return user.preferred_language
    # otherwise try to guess the language from the user accept
    # header the browser transmits. The best match wins.
    return request.accept_languages.best_match(conf.LANGUAGES.keys())

# @g.babel.timezoneselector
# def get_timezone():
#     user = getattr(g, 'user', None)
#     if user is not None:
#         return user.timezone
