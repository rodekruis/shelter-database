#! /usr/bin/python
#-*- coding:utf-8 -*

import os
import glob
import shutil

import conf
from web.models import Shelter, Category, ShelterDocument
from bootstrap import db

def import_shelters_documents(folder):
    shelters = Shelter.query.all()

    category = Category.query.filter(Category.name=="Documents",
                            Category.parent_id!=None).first()
    if not category:
        raise Exception("import_shelters_documents: No such category.")

    for shelter in shelters:
        shelter_rid = shelter.get_values_of_attribute(attribute_name='ID')[0].name

        for document in glob.glob(folder + shelter_rid + '/*'):
            document_name = os.path.basename(document)

            new_document = ShelterDocument(file_name=document_name,
                                shelter_id=shelter.id,
                                category_id=category.id)
            db.session.add(new_document)
            db.session.commit()

            path = os.path.join(conf.SHELTERS_DOCUMENTS_SERVER_PATH,
                                                        str(shelter.id))
            if not os.path.exists(path):
                os.makedirs(path)

            shutil.copy(document, path)
