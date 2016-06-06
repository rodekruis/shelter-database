#! /usr/bin/python
#-*- coding:utf-8 -*

import csv

from web.models import Translation
from bootstrap import db

def import_translation(translation_file, language_code):

    with open(translation_file, newline='') as translation:
        translations = csv.reader(translation, delimiter=',')


        for translation_line in translations:
            #print(translation[:3])


            for index, original_string in enumerate(translation_line[:2]):
                if original_string:
                    print("{} -> {}".format(original_string,
                                            translation_line[index+3]))

                    translation = Translation(
                                    original=original_string,
                                    translated=translation_line[index+3],
                                    language_code=language_code
                    )
                    db.session.add(translation)
                    db.session.commit()
