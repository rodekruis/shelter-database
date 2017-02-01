#! /usr/bin/python
#-*- coding:utf-8 -*

import os

import conf
from web.models import Shelter, ShelterPicture
from bootstrap import db
from PIL import Image

def create_shelters_thumbnails():
    shelters = Shelter.query.all()
    pictures = ShelterPicture.query.filter(ShelterPicture.is_main_picture==True).all()
    
    for picture in pictures:
        filepath = os.path.join(conf.SHELTERS_PICTURES_SERVER_PATH, str(picture.shelter_id), picture.file_name)
        basename, ext = os.path.splitext(picture.file_name)
        if str(basename.rpartition('_')[2]) == 'thumbnail':
            continue
        try:
            thumbname = basename + '_thumbnail' + ext
            new_thumbpath = os.path.join(conf.SHELTERS_PICTURES_SERVER_PATH, str(picture.shelter_id), thumbname)
            if os.path.exists(new_thumbpath):
                if db.session.query(ShelterPicture).filter_by(file_name=thumbname).first():
                    continue
            im = Image.open(filepath)
            im.thumbnail((300,200), Image.ANTIALIAS)
            im.save(new_thumbpath, 'JPEG', quality=70, optimize=True, progressive=True)
            
            new_picture = ShelterPicture(file_name=thumbname,
                                    shelter_id=picture.shelter_id,
                                    category_id=picture.category_id,
                                    is_main_picture=True)
            db.session.add(new_picture)
            db.session.commit()
            
        except:
            print("Failed to create thumbnail for shelter {}, file {}".format(picture.shelter_id, picture.file_name))
            continue

