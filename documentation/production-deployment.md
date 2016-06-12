
This procedure details the deployment of the application under Apache.

Tested with the following configurations:

* Debian 7, Python 3.5.1, PostgreSQL 9.1, Apache 2.2.22, mod_wsgi 4.4.13;
* Debian 8, Python 3.5.1, PostgreSQL 9.4, Apache 2.4.10, mod_wsgi 4.4.13;
* Ubuntu 16.04, Python 3.5.1+, PostgreSQL 9.5.3, Apache 2.4.18, mod_wsgi 4.4.13.



# Standalone installation

First we install the application for a simple standalone mode.

## Installation of Python


```shell
apt-get install build-essential openssl libssl-dev git

wget https://www.python.org/ftp/python/3.5.1/Python-3.5.1.tgz
tar -xzvf Python-3.5.1.tgz
rm Python-3.5.1.tgz
cd Python-3.5.1/
./configure --enable-shared --with-ensurepip=install
make
sudo make install
cd ..
sudo rm -Rf Python-3.5.1/
```

## Install and configure the database

```shell
sudo apt-get install -y postgresql postgresql-server-dev-9.1 postgresql-client
echo "127.0.0.1:5432:shelter:pgsqluser:pgsqlpwd" > ~/.pgpass
chmod 0600 ~/.pgpass
sudo -u postgres createuser pgsqluser --no-superuser --createdb --no-createrole
sudo -u postgres createdb shelter --no-password```shellsudo -u postgres psql
```

## Retrieve the application *Shelter Database*

```shell
git clone https://git.list.lu/charism/shelter-database.git
cd shelter-database/
sudo pip3.5 install --upgrade -r requirements.txt
cp conf/conf.cfg-sample conf/conf.cfg
```

## Install the JavaScript requirements with Bower

### Installation of node

```shell
cd
git clone https://github.com/joyent/node.git
cd node

git tag # list all the versions available
git checkout v0.12.7

./configure
make
sudo make install

node -v # check the version

cd ..
rm -Rf node/
```

### Installation of NPM

```shell
curl -l https://npmjs.org/install.sh | sudo sh

npm -v # check the version
```

### Installation of Bower

```shell
npm install -g bower
```

### Installation of our JavaScript dependencies

```shell
cd
cd shelter-database/
npm install
```

You can now run the application in standalone mode:

```shell
$ python3.5 runserver.py
 * Running on http://0.0.0.0:5000/ (Press CTRL+C to quit)
```

For a production server continue with the next steps.



# Deployment with Apache and mod_wsgi

## Installation of Apache and mod_wsgi

```shell
sudo apt-get install apache2 apache2-prefork-dev
wget https://github.com/GrahamDumpleton/mod_wsgi/archive/4.4.13.tar.gz
tar -xzvf 4.4.13.tar.gz
rm 4.4.13.tar.gz
cd mod_wsgi-4.4.13/
./configure --with-python=/usr/local/bin/python3.5
make
sudo make install
cd ..
sudo rm -Rf mod_wsgi-4.4.13/
echo 'LoadModule wsgi_module /usr/lib/apache2/modules/mod_wsgi.so' > /etc/apache2/mods-available/wsgi.load
sudo service apache2 restart
sudo a2enmod wsgi
```

## The WSGI file

Below is an example of WSGI file (**/var/www/shelter-database/webserver.wsgi**).

```python
#!/usr/bin/env python3.5

import sys

sys.path.insert(0, '/home/shelter/shelter-database/')

from runserver import app as application
```


## The VirtualHost configuration file

Below an example for the file **/etc/apache2/sites-available/shelter-database**

```shell
<VirtualHost *:80>
    ServerName shelter-database.org
    WSGIDaemonProcess webserver user=shelter group=shelter threads=5
    WSGIScriptAlias / /var/www/shelter-database/webserver.wsgi

    <Directory /var/www/shelter-database>
        WSGIProcessGroup webserver
        WSGIApplicationGroup %{GLOBAL}
        WSGIPassAuthorization On
        Order deny,allow
        Allow from all
    </Directory>
</VirtualHost>
```

Enable the site:

```shell
sudo a2ensite shelter-database
```

The web application is now be running with a dedicated user and a thread limit
set to 5.
