#! /bin/sh

python3.5 manager.py db_empty
python3.5 manager.py db_create

# Import the 'help' pages in the database
python3.5 manager.py import_page Bibliography data/pages/bibliography.html en
python3.5 manager.py import_page Recommendations data/pages/recommendations.html en
python3.5 manager.py import_page Glossary data/pages/glossary.html en
python3.5 manager.py import_page About data/pages/about.html en

# Initializes the structure of the shelters
python3.5 manager.py init_db_structure data/shelters/Shelters_Structure.csv

# Initializes the administrator (owner of the imported shelters)
python3.5 manager.py create_admin_user

# Import of the shelters from the CSV files
python3.5 manager.py import_shelters admin data/shelters/20150518_Haiti_shelters.csv
python3.5 manager.py import_shelters admin data/shelters/Phil-Bangla-Burundi.csv
