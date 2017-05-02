#! /usr/bin/python
#-*- coding:utf-8 -*

import os
import glob
import shutil

import conf
from web.models import Shelter, Category, ShelterPicture
from bootstrap import db

#! /usr/bin/python
#-*- coding:utf-8 -*

import os
import glob
import shutil

import conf
from web.models import Shelter, Category, ShelterPicture
from bootstrap import db
from PIL import Image, ImageFile
from os.path import join

from sqlalchemy import func

def insensitive_glob(pattern):
    def either(c):
        return '[%s%s]'%(c.lower(),c.upper()) if c.isalpha() else c
    return glob.glob(''.join(map(either,pattern)))

def build_replace_func(chars, attr, replace_with=''):
    for character in chars:
        attr = func.replace(attr, character, replace_with)
    return attr

def import_shelters_pictures(folder):
    
    ImageFile.LOAD_TRUNCATED_IMAGES = True
    imgwidth = 1280
    types = ('*.jpg', '*.jpeg', '*.png', '*.gif')
    
    shelters = Shelter.query.all()

    for shelter in shelters:
        shelter_rid = shelter.get_values_of_attribute(attribute_name='ID')[0].name
        print("Shelter_rid '{}' ...".format(shelter_rid))
        print("Shelter id '{}' ...".format(shelter.id))

        files = []
        for ext in types:
              files.extend(insensitive_glob(join(folder + shelter_rid + '/', ext)))
				
        for picture in files:
            picture_name = os.path.splitext(os.path.basename(picture))[0]+'.jpg'
            print("Picture name '{}' ...".format(picture_name))
            
            try:
                category_name = picture_name.split('_')[1]
                picture_subject = os.path.splitext(picture_name.split('_')[2])[0]
            except:
                print("failed")
                continue

            IGNORE_CHARS = [' ']
            needle = build_replace_func(IGNORE_CHARS, Category.name)
            print("Picture subject '{}' ...".format(picture_subject))
            print("Category name '{}' ...".format(category_name))
            category = Category.query.filter(func.lower(needle)==func.lower(category_name.replace(" ", "")),
                                    Category.parent_id!=None).first()
			
            if category:
                print ("Category ID: '{}' ...".format(category.id))
                if picture_subject.lower() == 'facade':
                    new_picture = ShelterPicture(file_name=picture_name,
                                    shelter_id=shelter.id,
                                    category_id=category.id,
                                    is_main_picture=True)
                else:
                    new_picture = ShelterPicture(file_name=picture_name,
                                    shelter_id=shelter.id,
                                    category_id=category.id)

                db.session.add(new_picture)
                db.session.commit()

                path = os.path.join(conf.SHELTERS_PICTURES_SERVER_PATH,
                                                            str(shelter.id))
                if not os.path.exists(path):
                    os.makedirs(path)

                #shutil.copy(picture, path)
                
                im = Image.open(picture)
				
                width, height = im.size

                hsize = int(float(im.size[1]))
                print((imgwidth, hsize, width, height))
                
				#if width is wider than max width, then scale both height and width
                if width > imgwidth:
                    ratio = (imgwidth/width)
                    height = int(height*ratio)
                    width = imgwidth
                    print((ratio))
					
                try:
                	resized_im = im.resize((width,height), Image.BICUBIC)
                	resized_im.save(os.path.join(path , picture_name), "JPEG", quality=70, optimize=True, progressive=True)
                except OSError:
                   im.save(os.path.join(path, picture_name), "JPEG", quality=70, optimize=True, progressive=True)
                   pass
                   
                print("Copy from '{}' ...".format(picture))
                print("Copy to '{}' ...".format(path))

