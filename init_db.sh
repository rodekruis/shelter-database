#! /bin/sh

python3.5 manager.py db_empty
python3.5 manager.py db_create

python3.5 manager.py init_db_structure
python3.5 manager.py import_shelters
