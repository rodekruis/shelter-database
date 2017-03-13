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
__version__ = "$Revision: 0.8 $"
__date__ = "$Date: 2016/05/31$"
__revision__ = "$Date: 2016/06/21 $"
__copyright__ = "Copyright 2016 Luxembourg Institute of Science and Technology"
__license__ = ""

import os
from werkzeug.utils import secure_filename
from flask import Blueprint, request, flash, render_template, current_app, \
                    url_for, redirect, make_response
from flask_login import login_required, current_user

from PIL import Image, ImageFile

import conf
import time
import logging
import logging.handlers
from bootstrap import db
from web.views.common import load_shelter_info
from web.lib.utils import redirect_url, allowed_file, create_thumbnail
from web.lib.misc_utils import create_pdf
from web.forms import LoginForm
from web.models import Shelter, Property, \
                        ShelterPicture, ShelterDocument, Section, Association, Value, User

shelter_bp = Blueprint('shelter_bp', __name__, url_prefix='/shelter')
shelters_bp = Blueprint('shelters', __name__, url_prefix='/shelters')

@shelter_bp.route('/<int:shelter_id>/<section_name>', methods=['GET'])
@shelter_bp.route('/<int:shelter_id>/<section_name>/<to_pdf>', methods=['GET'])
def details(shelter_id=0, section_name="", to_pdf=None):
    sections = Section.query.filter()
    try:
        shelter, section, categories, pictures, documents = \
                                load_shelter_info(shelter_id, section_name)
    except Exception as e:
        flash(str(e), "warning")
        return redirect(redirect_url())

    if to_pdf == "to_pdf":
        try:
            pdf_file = create_pdf(render_template('pdf/template1.html',
                                    shelter=shelter, section=section,
                                    categories=categories, pictures=pictures))
            response = make_response(pdf_file)
            response.headers['Content-Type'] = 'application/pdf'
            response.headers['Content-Disposition'] = \
                'attachment; filename=%s.pdf' % 'shelter'
            return response
        except Exception as e:
            print(e)
            flash('Error when generating PDF file.', 'danger')

    return render_template('details.html', shelter=shelter,
                        categories=categories, pictures=pictures,
                        sections=sections, section=section, documents=documents)


@shelter_bp.route('/edit/<int:shelter_id>/<section_name>', methods=['GET'])
@login_required
def edit(shelter_id=0, section_name=""):
    shelter = Shelter.query.filter(Shelter.id == shelter_id).first()

    if current_user.is_admin:
        pass
    elif shelter is not None and current_user.id == shelter.user_id:
        pass
    else:
        return redirect(url_for('join')) #render_template('errors/403.html'), 403

    user = User.query.filter(User.id == shelter.user_id).first()

    sections = Section.query.filter()
    try:
        shelter, section, categories, pictures, documents = \
                                load_shelter_info(shelter_id, section_name)
    except Exception as e:
        flash(str(e), "warning")
        return redirect(redirect_url())

    return render_template('edit.html', shelter=shelter, categories=categories,
                           pictures=pictures, sections=sections, section=section,
                           documents=documents, user=user)


@shelter_bp.route('/delete/<int:shelter_id>', methods=['GET'])
@login_required
def delete(shelter_id=0, section_name=""):
    """
    Delete a shelter. if created by requesting user
    """
    shelter = Shelter.query.filter(Shelter.id==shelter_id,
                                   Shelter.user_id==current_user.id)
    if shelter is not None:
        ShelterPicture.query.filter(ShelterPicture.shelter_id==shelter_id).delete()

        properties = Property.query.filter(Property.shelter_id==shelter_id)
        for property in properties:
            Association.query.filter(Association.property_id==property.id).delete()
            db.session.delete(property)

        shelter.delete()
        db.session.commit()

    return redirect(redirect_url())


@shelter_bp.route('/edit/<int:shelter_id>/<section_name>', methods=['POST'])
@login_required
def get_media(shelter_id=0, section_name=""):
    """
    Get the media (pictures or documents) for the shelter sent via a POST
    request.
    """
    shelter = Shelter.query.filter(Shelter.id==shelter_id).first()
    if not shelter:
        flash("No such shelter", "warning")
        return redirect(redirect_url())

    file = request.files.get('mediafile', None)
    if file and file.filename == '':
        flash('No selected file', 'warning')
        return redirect(request.url)
    if file and allowed_file(file.filename,
                                conf.ALLOWED_EXTENSIONS_PICTURE.union(
                                            conf.ALLOWED_EXTENSIONS_DOCUMENT)):
        if 'pictures' in request.form:
            path = os.path.join(conf.SHELTERS_PICTURES_SERVER_PATH, str(shelter.id))
        if 'documents' in request.form:
            path = os.path.join(conf.SHELTERS_DOCUMENTS_SERVER_PATH, str(shelter.id))
        if not os.path.exists(path):
            os.makedirs(path)
        filename = secure_filename(file.filename)
        file.save(os.path.join(path , filename))

        category_id = request.form['category_id']
		
        if category_id:
            if 'pictures' in request.form:
                new_media = ShelterPicture(file_name=filename,
                        shelter_id=shelter.id, category_id=category_id)
            if 'documents' in request.form:
                new_media = ShelterDocument(file_name=filename,
                        shelter_id=shelter.id, category_id=category_id)
            db.session.add(new_media)
            db.session.commit()

    return redirect(request.url)

@shelter_bp.route('/edit/multidocument/<int:shelter_id>/<category_id>/<section>', methods=['POST'])
@login_required
def get_multimedia_documents(shelter_id=0, category_id=2, section="Documents"):
    """
    Get the media (documents) for the shelter sent via a POST
    request.
    """
    shelter = Shelter.query.filter(Shelter.id==shelter_id).first()
	
    if not shelter:
        return 'no such shelter', 400 

    file = request.files.get('mediafile', None)

    for f in request.files:
        if request.files[f] and request.files[f].filename == '':
            return 'No selected file', 400 
        if request.files[f] and not allowed_file(request.files[f].filename,
                                conf.ALLOWED_EXTENSIONS_DOCUMENT):	
            return 'File type not allowed', 400
		
        path = os.path.join(conf.SHELTERS_DOCUMENTS_SERVER_PATH, str(shelter.id))
        logging.debug('path:' + path)
			
        if not os.path.exists(path):
            os.makedirs(path)

        filename = secure_filename(request.files[f].filename)
        request.files[f].save(os.path.join(path , filename))

        if category_id:
            new_media = ShelterDocument(file_name=filename,
               shelter_id=shelter.id, category_id=category_id)
            db.session.add(new_media)
            db.session.commit()
            return str(new_media.id), 200

    return 'Document not uploaded', 400
			
@shelter_bp.route('/edit/multi/<int:shelter_id>/<category_id>/<section>', methods=['POST'])
#@login_required
def get_multi_media(shelter_id=0, category_id=2, section = 'Identification'):
    """
    Get pictures for the shelter sent by Dropzone via a POST
    request.
    """
    first = True
    ImageFile.LOAD_TRUNCATED_IMAGES = True
    imgwidth = 1280
	
    shelter = Shelter.query.filter(Shelter.id==shelter_id).first()
    shelter_id_query = db.session.query(Value.name)\
        .join(Association,Property,Shelter)\
        .filter(Shelter.id==shelter_id, Property.attribute_id==1)\
        .first()
    
    shelter_id_attribute = shelter_id_query[0]
    
    if not shelter:
        return 'no such shelter', 400 

    for f in request.files:
        if request.files[f] and request.files[f].filename == '':
            return 'No selected file', 400 
        if request.files[f] and allowed_file(request.files[f].filename,
                                conf.ALLOWED_EXTENSIONS_PICTURE.union(
                                            conf.ALLOWED_EXTENSIONS_DOCUMENT)):								
            path = os.path.join(conf.SHELTERS_PICTURES_SERVER_PATH, str(shelter.id))
            logging.debug('path:' + path)
			
            if not os.path.exists(path):
                os.makedirs(path)

            file_extension = os.path.splitext(request.files[f].filename)[1]
            
            exist_main = db.session.query(ShelterPicture.is_main_picture).filter(ShelterPicture.is_main_picture==True,ShelterPicture.shelter_id==shelter.id).first()
            if not exist_main: 
            	filename = str(shelter_id_attribute) + '_' + section + "_" + "Facade" + file_extension
            	thumbname = str(shelter_id_attribute) + '_' + section + "_" + "Facade_thumbnail" + file_extension
            else:
            	filename = str(shelter_id_attribute) + '_' + section + "_" + str(time.time()) + file_extension
            	thumbname = str(shelter_id_attribute) + '_' + section + "_" + "thumbnail" + file_extension
            	first = False
            
            
            im = Image.open(request.files[f])
            if im.size[0] > imgwidth:
                ratio = (imgwidth/float(im.size[0]))
                hsize = int((float(im.size[1])*float(ratio)))
                try:
                	imagefile = im.resize((imgwidth,hsize), Image.BICUBIC)
                except OSError:
                   return 'Failed to resize picture, please resize to ' + imgwidth + ' pixels width', 400               
            else:
                imagefile = im
            
            imagefile.save(os.path.join(path , filename), "JPEG",quality=70, optimize=True, progressive=True)
            
            create_thumbnail(filename, thumbname, path)
            
            # save backup image:
            backup_dir = os.path.join(conf.SHELTERS_PICTURES_BACKUP_PATH, str(shelter_id_attribute))
            
            if not os.path.exists(backup_dir):
                os.makedirs(backup_dir)
                
            im.save(os.path.join(backup_dir , filename), "JPEG",quality=70, optimize=True, progressive=True)
            
        if category_id:
            new_media = ShelterPicture(file_name=filename,  is_main_picture=first,
                shelter_id=shelter.id, category_id=category_id)
            
            new_thumbnail = ShelterPicture(file_name=thumbname,  is_main_picture=first,
                shelter_id=shelter.id, category_id=category_id)
            db.session.add_all([new_media, new_thumbnail])
            db.session.commit()

    return str(new_media.id), 200


@shelter_bp.route('/delete_picture/<int:picture_id>', methods=['GET','POST'])
@login_required
def delete_picture(picture_id=None):
    picture = ShelterPicture.query.filter(ShelterPicture.id==picture_id).first()
    if picture:
        os.unlink(os.path.join(conf.SHELTERS_PICTURES_SERVER_PATH,
                                str(picture.shelter_id),
                                str(picture.file_name)))
        db.session.delete(picture)
        db.session.commit()

    return redirect(url_for('shelter_bp.edit', shelter_id=picture.shelter_id,
                                section_name="general-Information"))

@shelter_bp.route('/delete_document/<int:document_id>', methods=['GET'])
@login_required
def delete_document(document_id=None):
    document = ShelterDocument.query.filter(ShelterDocument.id==document_id).first()
    if document:
        os.unlink(os.path.join(conf.SHELTERS_DOCUMENTS_SERVER_PATH,
                                str(document.shelter_id),
                                str(document.file_name)))
        db.session.delete(document)
        db.session.commit()

    return redirect(url_for('shelter_bp.edit', shelter_id=document.shelter_id,
                                section_name="general-Information"))
