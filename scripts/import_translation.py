#! /usr/bin/python
#-*- coding:utf-8 -*

import csv

from web.models import Translation
from bootstrap import db

def import_translation(translation_file, language_code):

    with open(translation_file, newline='', encoding='utf-8') as translation:
        translations = csv.reader(translation, delimiter=',')


        for translation_line in translations:
            for index, original_string in enumerate(translation_line[:3]):
                if original_string:
                    #print("{} -> {}".format(original_string,
                                            #translation_line[index+3]))
                    if index==2:
                        # column for the values
                        originals = original_string.split(";")
                        translations = translation_line[index+3].split(";")

                        for original_string, translated_string in zip(originals, translations):
                            translation = Translation(
                                            original=original_string.strip(),
                                            translated=translated_string.strip(),
                                            language_code=language_code
                            )
                            db.session.add(translation)
                    else:
                        # column for the attributes and sections
                        translation = Translation(
                                        original=original_string.strip(),
                                        translated=translation_line[index+3].strip(),
                                        language_code=language_code
                        )
                        db.session.add(translation)
            db.session.commit()
