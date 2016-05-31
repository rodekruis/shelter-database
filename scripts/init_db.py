#! /usr/bin/python
#-*- coding:utf-8 -*

import csv

from web import models
from bootstrap import db

def init_db():
    print("Importing base structure of shelters...")
    with open('data/Shelters_Structure.csv', newline='') as csvfile:
        structure = csv.reader(csvfile, delimiter=',')
        category = None
        sub_category = None
        sub_category_name = ''
        display_position = 0
        for index, row in enumerate(structure):
            if index == 0:
                continue

            display_position += 1

            if row[0] != '':
                category_name = row[0]
                category = models.Category(name=category_name)
                db.session.add(category)
                db.session.commit()
                display_position = 1

            if sub_category_name != row[1]:
                sub_category_name = row[1]
                sub_category = models.Category(name=sub_category_name)
                db.session.add(sub_category)
                category.sub_categories.append(sub_category)
                db.session.commit()


            attribute_name = row[2]
            attribute = models.Attribute(name=attribute_name,
                                        category_id=sub_category.id,
                                        display_position=display_position)
            attribute_type = row[3] # TODO: do something with row[3] ...

            cardinality = row[5]
            attribute.multiple = cardinality=='multiple choice'
            #if cardinality == '':
                # free text for the value of this attribute
            if cardinality in ('single choice', 'multiple choice'):
                for value in row[4].split(';'):
                    value_name = value.strip()
                    value = models.Value(name=value_name,
                                            attribute_id=attribute.id)
                    db.session.add(value)
                    attribute.associated_values.append(value)
            else:
                attribute.free_text = True

            db.session.add(attribute)
            db.session.commit()

            #images = row[7]
