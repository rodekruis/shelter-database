#! /bin/sh

python3.5 manager.py db_empty
python3.5 manager.py db_create

python3.5 manager.py init_db
python3.5 manager.py populate_shelters

