#! /bin/sh
python3.5 src/manager.py db_empty
python3.5 src/manager.py db_create

# Import the 'help' pages in the database
python3.5 src/manager.py import_page Bibliography data/pages/bibliography.html en
python3.5 src/manager.py import_page Recommendations data/pages/recommendations.html en
python3.5 src/manager.py import_page Glossary data/pages/glossary.html en
python3.5 src/manager.py import_page About data/pages/about.html en
python3.5 src/manager.py import_page About data/pages/about_fr.html fr

# Initializes the structure of the shelters
python3.5 src/manager.py init_shelters_structure data/shelters/Shelters_Structure.csv data/shelters/drawings

# Initializes the administrator (owner of the imported shelters)
python3.5 src/manager.py create_admin_user

# Import of the shelters from the CSV files
python3.5 src/manager.py import_shelters admin data/shelters/datadump.csv

# Import pictures of the shelters
python3.5 src/manager.py import_shelters_pictures data/shelters/pictures/
# Create picture thumbnails
python3.5 src/manager.py create_shelters_thumbnails

# Import documents of the shelters
python3.5 src/manager.py import_shelters_documents data/shelters/documents/

# Import of the translations
python3.5 src/manager.py import_translation data/translations/sheltersDataTraduction_FR_rev_ED.csv fr
python3.5 src/manager.py import_translation data/translations/sheltersDataTranslation_ES.csv es

# Create database triggers for materialized view table
python3.5 src/manager.py create_db_triggers
