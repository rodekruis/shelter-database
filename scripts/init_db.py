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
            attribute = models.Attribute(name=attribute_name,
                                        category_id=sub_category.id,
                                        display_position=display_position)
            attribute.type = row[4]

            cardinality = row[6]
            attribute.multiple = cardinality=='multiple choice'

            if cardinality in ('single choice', 'multiple choice'):
                for value in row[5].split(';'):
                    value_name = value.strip()
                    if value_name == 'other':
                        # the user will be able to add new values for this
                        # attribute, when the proposed ones are not suitable
                        attribute.user_can_add_values = True
                        continue
                    value = models.Value(name=value_name,
                                        attribute_id=attribute.id)
                    db.session.add(value)
                    attribute.associated_values.append(value)

            else:
                attribute.free_text = True

            attribute.is_editable = "automatic" not in row[6] and \
                                            "not_editable" not in row[6]
            attribute.is_mandatory = "mandatory" not in row[6]


            pictures = row[8].split(";")
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

                            path = os.path.join(conf.ATTRIBUTES_PICTURES_PATH,
                                                'en')
                            if not os.path.exists(path):
                                os.makedirs(path)

                            shutil.copy(drawning, path)

                            break


            db.session.add(attribute)
            db.session.commit()
