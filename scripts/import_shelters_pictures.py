#! /usr/bin/python
#-*- coding:utf-8 -*

import os
import glob
import shutil

from web.models import Shelter, Category, ShelterPicture
from bootstrap import db

def import_shelters_pictures(folder):
    shelters = Shelter.query.all()

    for shelter in shelters:
        shelter_rid = shelter.get_values_of_attribute(attribute_name='ID')[0].name

        for picture in glob.glob(folder + shelter_rid + '/**.jpg'):
            picture_name = os.path.basename(picture)
            try:
                category_name = picture_name.split('_')[1]
            except:
                continue

            category = Category.query.filter(Category.name==category_name,
                                    Category.parent_id!=None).first()

            if category:
                new_picture = ShelterPicture(file_name=picture_name,
                                shelter_id=shelter.id,
                                category_id=category.id)
                db.session.add(new_picture)
                db.session.commit()

                path = os.path.join('./web/public/pictures/shelters/', str(shelter.id))
                if not os.path.exists(path):
                    os.makedirs(path)

                shutil.copy(picture, path)

        print()
