#! /usr/bin/python
#-*- coding:utf-8 -*

import conf
import os
import shutil
import sys
from web.models import Property, Value, Association
from bootstrap import db

def export_shelters_pictures(dump_dir, foldername):
    
    if os.path.exists(os.path.join(dump_dir, foldername)):
    	print("Export aborted: Directory \"{}\" already exists. Erase it or choose a new directory".format(foldername))
    	sys.exit(1)
    else:
    	pass
    
    picpath = conf.SHELTERS_PICTURES_SERVER_PATH
    
    query = db.session.query(Property.shelter_id.label('db_id'), Value.name.label('id'))\
        .join(Association, Association.property_id==Property.id)\
        .join(Value, Value.id==Association.value_id)\
        .filter(Property.attribute_id==1)\
        .order_by(Property.shelter_id)

    #print(query)
    
    id = {}
    
    for row in query:
        id[row.db_id] = row.id 
      
    
    ###dump published shelters
    dst_published = os.path.join(dump_dir, foldername)
    
    if not os.path.exists(dst_published):
        os.makedirs(dst_published)
    
    for root, dirs, files in os.walk(picpath):
        if len(dirs) != 0:
            for d in dirs:
                if not os.path.exists(os.path.join(dst_published, id[int(d)])):
                    os.makedirs(os.path.join(dst_published, id[int(d)]))
        
        if len(files) != 0:
            for f in files:
                pass
                shutil.copy(os.path.join(root,f) ,os.path.join(dst_published, id[int(os.path.basename(root))]))
                
        
        
        
        
        
        
        
        
        
        
        

