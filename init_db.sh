#! /bin/sh

python src/manager.py db_empty
python src/manager.py db_create

# Initializes the structure of the shelters
python src/manager.py init_shelters_structure data/shelters/Shelters_Structure_small.csv data/shelters/drawings

# Initializes the administrator (owner of the imported shelters)
python src/manager.py create_admin_user

# Import of the shelters from the CSV files
python src/manager.py import_shelters admin data/shelters/shelterdump_published.csv

# Import pictures of the shelters
python src/manager.py import_shelters_pictures data/shelters/pictures/
# Create picture thumbnails
python src/manager.py create_shelters_thumbnails

# Import documents of the shelters
python src/manager.py import_shelters_documents data/shelters/documents/

# Import of the translations
#python3.5 src/manager.py import_translation data/translations/sheltersDataTraduction_FR_rev_ED.csv fr
#python3.5 src/manager.py import_translation data/translations/sheltersDataTranslation_ES.csv es

# Create database triggers for materialized view table
python src/manager.py create_db_triggers
