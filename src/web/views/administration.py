#! /usr/bin/env python
#-*- coding: utf-8 -*-

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
__date__ = "$Date: 2016/06/02$"
__revision__ = "$Date: 2016/06/02 $"
__copyright__ = "Copyright 2016 Luxembourg Institute of Science and Technology"
__license__ = ""

import os
import zipfile
from flask import Blueprint, flash, render_template, current_app, redirect, \
                    url_for, request
from werkzeug import generate_password_hash
from werkzeug.utils import secure_filename
from flask_login import login_required, current_user
from sqlalchemy import distinct

import conf
import manager
from scripts import import_translation
from bootstrap import db
from web.views.common import admin_permission
from web.lib.utils import redirect_url, allowed_file
from web.lib.misc_utils import launch_background_process
from web.models import Shelter, Page, User, Category, Attribute, Value, \
                        Property, Association, \
                        AttributePicture, Translation, ShelterPicture
from web.forms import CategoryForm, AttributeForm, CreateUserForm, EditUserForm

admin_bp = Blueprint('administration', __name__, url_prefix='/admin')

@admin_bp.route('/dashboard', methods=['GET', 'POST'])
@login_required
@admin_permission.require(http_exception=403)
def dashboard():
    if request.method == 'POST':
        if 'shelters' in request.form:
            file = request.files.get('shelterfile', None)
            if file and file.filename == '':
                flash('No selected file', 'warning')
            if file and allowed_file(file.filename, conf.ALLOWED_EXTENSIONS_CSV):
                filename = secure_filename(file.filename)
                filepath = os.path.join('/tmp', filename)
                file.save(filepath)
                launch_background_process(['import_shelters',
                                            current_user.name, filepath])
                flash('Importing shelters in background...', 'success')
            else:
                flash('File not allowed', 'danger')


        elif 'translations' in request.form:
            file = request.files.get('translationfile', None)
            if file and file.filename == '':
                flash('No selected file', 'warning')
                return redirect(request.url)
            if file and allowed_file(file.filename, conf.ALLOWED_EXTENSIONS_CSV):
                language_code = request.form.get('language_code')
                if language_code:
                    filename = secure_filename(file.filename)
                    filepath = os.path.join('/tmp', filename)
                    file.save(filepath)
                    launch_background_process(['import_translation',
                                                filepath, language_code])
                    flash('Importing translations in background...', 'success')
                else:
                    flash('Bad language code', 'danger')
            else:
                flash('File not allowed', 'danger')


        elif 'pictures' in request.form:
            file = request.files.get('picturesfile', None)
            if file and file.filename == '':
                flash('No selected file', 'warning')
            if file and allowed_file(file.filename, conf.ALLOWED_EXTENSIONS_ARCHIVE):
                filename = secure_filename(file.filename)
                filepath = os.path.join('/tmp', filename)
                file.save(filepath)
                with zipfile.ZipFile(filepath, 'r') as z:
                    z.extractall('/tmp/sdPictures')
                launch_background_process(['import_shelters_pictures', '/tmp/sdPictures/'])
                flash('Importing pictures of shelters in background...', 'success')
            else:
                flash('File not allowed', 'danger')


    nb_shelters = Shelter.query.count()
    nb_unpublished_shelters = Shelter.query.filter(Shelter.is_published==False).count()
    nb_commercial_shelters = Shelter.query.filter(Shelter.is_commercial==True).count()
    nb_users = User.query.count()
    imported_translations = db.session.query(distinct(Translation.language_code))

    return render_template('admin/dashboard.html',
                            nb_shelters=nb_shelters,
                            nb_unpublished_shelters=nb_unpublished_shelters,
                            nb_commercial_shelters=nb_commercial_shelters,
                            nb_users=nb_users,
                            imported_translations=imported_translations)

@admin_bp.route('/shelters', methods=['GET'])
@login_required
@admin_permission.require(http_exception=403)
def shelters():
    shelters = Shelter.query.filter().all()
    return render_template('admin/shelters.html', shelters=shelters)

@admin_bp.route('/pages', methods=['GET'])
@login_required
@admin_permission.require(http_exception=403)
def pages():
    language_code = "en"
    return render_template('admin/help_pages.html')

@admin_bp.route('/users', methods=['GET'])
@login_required
@admin_permission.require(http_exception=403)
def users():
    users = User.query.filter().all()
    return render_template('admin/users.html', users=users)

@admin_bp.route('/delete_shelter/<int:shelter_id>', methods=['GET'])
@login_required
@admin_permission.require(http_exception=403)
def delete_shelter(shelter_id=None):
    """
    Delete a shelter.
    """
    ShelterPicture.query.filter(ShelterPicture.shelter_id==shelter_id).delete()

    properties = Property.query.filter(Property.shelter_id==shelter_id)
    for property in properties:
        Association.query.filter(Association.property_id==property.id).delete()
        db.session.delete(property)

    Shelter.query.filter(Shelter.id==shelter_id).delete()
    db.session.commit()

    return redirect(redirect_url())

@admin_bp.route('/delete_user/<int:user_id>', methods=['GET'])
@login_required
@admin_permission.require(http_exception=403)
def delete_user(user_id=None):
    """
    Delete a user (with all its data).
    """
    user = User.query.filter(User.id==user_id).first()
    db.session.delete(user)
    db.session.commit()
    return redirect(redirect_url())

@admin_bp.route('/delete_translation/<string:language_code>', methods=['GET'])
@login_required
@admin_permission.require(http_exception=403)
def delete_translation(language_code=None):
    """
    Delete a translation.
    """
    Translation.query.filter(Translation.language_code==language_code).delete()
    db.session.commit()
    return redirect(redirect_url())

@admin_bp.route('/user/create', methods=['GET'])
@admin_bp.route('/user/edit/<int:user_id>', methods=['GET'])
@login_required
@admin_permission.require(http_exception=403)
def user_form(user_id=None):
    if user_id is not None:
        user = User.query.filter(User.id==user_id).first()
        form = EditUserForm(obj=user)
        form.password.data = "***"
        message = 'Edit the user <i>{}</i>'.format(user.name)
    else:
        form = CreateUserForm()
        message = 'Add a new user'
    return render_template('/admin/create_user.html',
                           form=form, message=message)

@admin_bp.route('/user/create', methods=['POST'])
@admin_bp.route('/user/edit/<int:user_id>', methods=['POST'])
@login_required
@admin_permission.require(http_exception=403)
def process_user_form(user_id=None):
    """
    Create or edit a user.
    """
    if user_id is not None:
        # Edit a user
        form = EditUserForm()
        if not form.validate():
            return render_template('/admin/create_user.html', form=form,
                                   message='Some errors were found')
        user = User.query.filter(User.id==user_id).first()

        if form.password.data:
            user.set_password(form.password.data)

        form.populate_obj(user)
        db.session.commit()
        flash('User successfully updated', 'success')
    else:
        # Create a new user (by the admin)
        form = CreateUserForm()
        if not form.validate():
            return render_template('/admin/create_user.html', form=form,
                                   message='Some errors were found')
        user = User(name=form.name.data,
                    email=form.email.data,
                    pwdhash=generate_password_hash(form.password.data),
                    is_admin=form.is_admin.data,
                    is_active=True)
        db.session.add(user)
        db.session.commit()
        flash('User successfully created', 'success')
    return redirect(url_for('administration.user_form', user_id=user.id))


@admin_bp.route('/toggle_user/<int:user_id>', methods=['GET'])
@login_required
@admin_permission.require(http_exception=403)
def toggle_user(user_id=None):
    """
    Enable or disable the account of a user.
    """
    user = User.query.filter(User.id==user_id).first()
    user.is_active = not user.is_active
    db.session.commit()
    return redirect(url_for('administration.users'))


@admin_bp.route('/attributes', methods=['GET'])
@admin_bp.route('/attributes/<int:category_id>', methods=['GET'])
@admin_bp.route('/attributes/<int:category_id>/<int:attribute_id>', methods=['GET'])
@login_required
@admin_permission.require(http_exception=403)
def attributes(category_id=None, attribute_id=None):
    if attribute_id:
        attribute = Attribute.query.filter(Attribute.id==attribute_id).first()
        form = AttributeForm(obj=attribute)
        return render_template('admin/values.html',
                            attribute=attribute,
                            form=form)

    if category_id:
        category = Category.query.filter(Category.id==category_id).first()
        form = CategoryForm(obj=category)
        return render_template('admin/attributes.html',
                            category=category,
                            form=form)

    categories = Category.query.filter(Category.parent_id!=None)
    return render_template('admin/categories.html', categories=categories)



@admin_bp.route('/attributes/<int:category_id>/<int:attribute_id>', methods=['POST'])
@login_required
@admin_permission.require(http_exception=403)
def attributes_add_pitures(category_id=None, attribute_id=None):
    attribute = Attribute.query.filter(Attribute.id==attribute_id).first()
    form = AttributeForm(obj=attribute)

    if form.validate_on_submit():

        if form.name.data != attribute.name:
            # update the name of the attribute
            old_name = attribute.name
            form.populate_obj(attribute)

            # update the translations appropriately
            Translation.query.filter(Translation.original==old_name).\
                            update({Translation.original: form.name.data})
            db.session.commit()


    # A picture has been submited
    file = request.files.get('imagefile', None)
    if file and file.filename == '':
        flash('No selected file', 'warning')
        return redirect(request.url)
    if file and allowed_file(file.filename, conf.ALLOWED_EXTENSIONS_PICTURE):
        filename = secure_filename(file.filename)
        file.save(os.path.join(current_app.config['PUBLIC_PATH'] + '/pictures/attributes/en', filename))

        new_picture = AttributePicture(file_name=filename,
                language_code='en', attribute_id=attribute_id)
        db.session.add(new_picture)
        db.session.commit()


    return render_template('admin/values.html',
                        attribute=attribute,
                        form=form)

@admin_bp.route('/delete_attribute_picture/<int:picture_id>', methods=['GET'])
@login_required
@admin_permission.require(http_exception=403)
def delete_attribute_picture(picture_id=None):
    picture = AttributePicture.query.filter(AttributePicture.id==picture_id).first()
    if picture:
        # TODO: delete physically
        db.session.delete(picture)
        db.session.commit()
    return redirect(redirect_url())
