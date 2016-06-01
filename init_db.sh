#! /bin/sh

python3.5 manager.py db_empty
python3.5 manager.py db_create

python3.5 manager.py init_db_structure data/Shelters_Structure.csv

python3.5 manager.py create_admin_user

python3.5 manager.py import_shelters admin data/20150518_Haiti_shelters.csv
python3.5 manager.py import_shelters admin data/Phil-Bangla-Burundi.csv
