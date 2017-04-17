#! /bin/sh

. src/conf/conf.cfg
echo $database_name

# drop completely the db (with the triggers, sequences, etc.)
sudo -u postgres dropdb $database_name
sudo -u postgres createdb $database_name --no-password
echo "ALTER USER pgsqluser WITH ENCRYPTED PASSWORD 'pgsqlpwd';" | sudo -u postgres psql
echo "GRANT ALL PRIVILEGES ON DATABASE $database_name TO pgsqluser;" | sudo -u postgres psql
