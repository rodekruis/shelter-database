#! /usr/bin/python
#-*- coding:utf-8 -*

import csv
import os.path
import sys
from web.models import Section, Category, Attribute, Property, Value, Association, Shelter
from bootstrap import db

def export_shelters(dump_file, truncate=''):
    if truncate == 'overwrite':
    	pass
    elif os.path.isfile(dump_file):
    	print("Export aborted: dump file already exists. Choose another filename or enable overwriting")
    	sys.exit(1)
    else:
    	pass
    
    Subcategory = db.aliased(Category)
    headersquery = db.session.query(Section.name.label("section"), Category.name.label("category"), Subcategory.name.label("subcategory"), Attribute.name.label("attribute"))\
        .join(Category, Category.section_id==Section.id)\
        .join(Subcategory, Subcategory.parent_id==Category.id)\
        .join(Attribute, Attribute.category_id==Subcategory.id)
    
    dataquery = db.session.query(Property.attribute_id.label('att_id'), Property.shelter_id, Value.name.label('value'))\
        .join(Association, Association.property_id==Property.id)\
        .join(Value, Value.id==Association.value_id)\
        .join(Attribute, Attribute.id==Property.attribute_id)\
        .join(Shelter, Shelter.id==Property.shelter_id)\
        .filter(Shelter.is_published==True)\
        .order_by(Property.shelter_id,Property.attribute_id)

    #print(dataquery)
    
    array=[]
    
    for index, row in enumerate(headersquery):
        
        section = row.section
        category = row.category
        
        # insert blanks instead of duplicate sections / categories
        if index != 0:
            if row.section == prev_row.section:
                section = ''
            if row.category == prev_row.category:
                category = ''
        
        array += [[section,category,row.subcategory, row.attribute]]
        prev_row = row
    
    columns_length = len(array)
    
    
    with open(dump_file, mode='wt',newline='', encoding='utf-8') as csvfile:
        shelters = csv.writer(csvfile, delimiter=',')
        
        #transpose array before write
        for cursor in zip(*array):
            shelters.writerow(cursor)
        
        r = [''] * columns_length
        
        for index, cursor in enumerate(dataquery):
            
            if index != 0:
                if cursor.shelter_id == prev_row.shelter_id:
                    r[cursor.att_id-1] = cursor.value
                else:
                    shelters.writerow(r)
                    r = [''] * columns_length
                    r[cursor.att_id-1] = cursor.value
            else:
                r[cursor.att_id-1] = cursor.value
    
            prev_row = cursor
        shelters.writerow(r)
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        

