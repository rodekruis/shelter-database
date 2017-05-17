#! /usr/bin/python
#-*- coding:utf-8 -*

import os
import glob
import shutil
import csv

import conf
from web import models
from bootstrap import db

def init_shelters_structure(csv_file, drawnings_folder):

    drawnings = glob.glob(drawnings_folder+"/*.jpg")

    with open(csv_file, newline='') as csvfile:
        structure = csv.reader(csvfile, delimiter=',')
        category = None
        sub_category = None
        sub_category_name = ''
        display_position = 0
        for line, row in enumerate(structure):
            if line == 0:
                continue

            display_position += 1

            if row[0] != '':
                section_name = row[0].strip()
                section = models.Section(name=section_name)
                db.session.add(section)
                db.session.commit()

            if row[1] != '':
                category_name = row[1].strip()
                category = models.Category(name=category_name)
                section.categories.append(category)
                db.session.add(category)
                db.session.commit()
                display_position = 1

            if sub_category_name != row[2]:
                sub_category_name = row[2]
                sub_category = models.Category(name=sub_category_name)
                db.session.add(sub_category)
                category.sub_categories.append(sub_category)
                db.session.commit()


            attribute_name = row[3]
            attribute_uniqueid = row[4]
            attribute = models.Attribute(name=attribute_name,
										uniqueid=attribute_uniqueid,
                                        category_id=sub_category.id,
                                        display_position=display_position)
            attribute.type = row[5]

            cardinality = row[7]
            attribute.multiple = cardinality=='multiple choice'

            if cardinality in ('single choice', 'multiple choice'):
                attribute.user_can_add_values = True
                for value in row[6].split(';'):
                    value_name = value.strip()
                    if value_name == 'other':
                        # because the user will be able to add new values with
                        # a dedicated button
                        continue
                    value = models.Value.query.filter(
                                        models.Value.name == value_name)\
                                        .first()
                    if not value:
                        value = models.Value(name=value_name,
                                            attribute_id=attribute.id)
                    db.session.add(value)
                    attribute.associated_values.append(value)

            else:
                attribute.free_text = True

            attribute.is_editable = "automatic" not in row[8] and \
                                            "not_editable" not in row[8]
            attribute.is_mandatory = "mandatory" not in row[8]


            pictures = row[9].split(";")
            for picture in pictures:
                if picture:
                    number = '_' + picture.replace('D', '') + '_'
                    for drawning in drawnings:
                        if number in drawning:
                            new_picture = models.AttributePicture(
                                            file_name=os.path.basename(drawning),
                                            language_code='en')
                            attribute.pictures.append(new_picture)
                            db.session.add(new_picture)

                            path = os.path.join(conf.ATTRIBUTES_PICTURES_SERVER_PATH,
                                                'en')
                            if not os.path.exists(path):
                                os.makedirs(path)

                            shutil.copy(drawning, path)

                            break


            db.session.add(attribute)
            db.session.commit()
