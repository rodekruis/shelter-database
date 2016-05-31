#! /usr/bin/python
#-*- coding:utf-8 -*

import csv

from web import models
from bootstrap import db

def populate_shelters():
    print("Importing shelters...")

    user = models.User(email="cedric.bonhomme@list.lu",
                        name="cedric",
                        pwdhash="",
                        is_admin=True,
                        is_active=True)
    db.session.add(user)
    db.session.commit()

    with open('data/20150518_Haiti_shelters.csv', newline='') as csvfile:
        shelters = csv.reader(csvfile, delimiter=',')

        for index, row in enumerate(shelters):
            if index == 0:
                section = row
                continue
            elif index == 1:
                category_level_1 = list(row)
                continue
            elif index == 2:
                category_level_2 = row
                continue
            elif index == 3:
                attributes = row
                continue



            # Creation of a new shelter
            shelter = models.Shelter(user_id=user.id)
            db.session.add(shelter)
            db.session.commit()

            # Association of the attribute of the new shelter
            for index, shelter_attributes in enumerate(row):
                if shelter_attributes:
                    #print(category_level_2[index])
                    attribute = models.Attribute.query.filter(
                            models.Attribute.name==attributes[index],
                            models.Attribute.category.has(name=category_level_2[index])).first()
                    if not attribute:
                        continue
                    #print("{} -> {}".format(elem, attribute.name))


                    values = []
                    for value in shelter_attributes.split(";"):
                        current_value = value.strip()
                        if not attribute.free_text:
                            value_obj = models.Value.query.filter(
                                    models.Value.name==current_value).first()
                            if not value_obj:
                                continue #TODO: check

                        else:



                            value_obj = models.Value(name=current_value)
                            db.session.add(value_obj)
                            attribute.associated_values.append(value_obj)
                            db.session.commit()

                        values.append(value_obj)

                    if values:
                        shelter_property = models.Property(shelter_id=shelter.id,
                                                attribute_id=attribute.id,
                                                attribute=attribute,
                                                category_id=attribute.category_id,
                                                category=attribute.category,
                                                values=values)
                        db.session.add(shelter_property)
                        db.session.commit()

            print()
