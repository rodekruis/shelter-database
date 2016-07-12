Deployment
==========

Shelter Database
""""""""""""""""

This procedure details the deployment of the application under Apache.

Tested with the following configurations:

* Debian 7, Python 3.5.1, PostgreSQL 9.1, Apache 2.2.22, mod_wsgi 4.4.13;
* Debian 8, Python 3.5.1, PostgreSQL 9.4, Apache 2.4.10, mod_wsgi 4.4.13;
* Ubuntu 16.04, Python 3.5.1+, PostgreSQL 9.5.3, Apache 2.4.18, mod_wsgi 4.4.13.



Standalone installation
-----------------------

First we install the application for a simple standalone mode.

Installation of Python
~~~~~~~~~~~~~~~~~~~~~~


.. code-block:: shell

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


Install and configure the database
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: shell

    sudo apt-get install -y postgresql postgresql-server-dev-9.1 postgresql-client
    echo "127.0.0.1:5432:shelter:pgsqluser:pgsqlpwd" > ~/.pgpass
    chmod 0600 ~/.pgpass
    sudo -u postgres createuser pgsqluser --no-superuser --createdb --no-createrole
    sudo -u postgres createdb aggregator --no-password
    echo "ALTER USER pgsqluser WITH ENCRYPTED PASSWORD 'pgsqlpwd';" | sudo -u postgres psql
    echo "GRANT ALL PRIVILEGES ON DATABASE shelter TO pgsqluser;" | sudo -u postgres psql


Retrieve the application *Shelter Database*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: shell

    git clone https://git.list.lu/charism/shelter-database.git
    cd shelter-database/
    sudo pip3.5 install --upgrade -r requirements.txt
    cp conf/conf.cfg-sample conf/conf.cfg

Initialization of the database
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: shell

    $ ./init_db.sh
    Dropping database...
    Creation of the database...
    Importing page from 'data/pages/bibliography.html' ...
    Importing page from 'data/pages/recommendations.html' ...
    Importing page from 'data/pages/glossary.html' ...
    Importing page from 'data/pages/about.html' ...
    Importing page from 'data/pages/about_fr.html' ...
    Importing base structure of shelters from 'data/shelters/Shelters_Structure.csv' ...
    Creation of the admin user...
    Importing shelters from 'data/shelters/20150518_Haiti_shelters.csv' ...
    Importing shelters from 'data/shelters/Phil-Bangla-Burundi.csv' ...
    Importing translation file from 'data/translations/sheltersDataTraduction_FR_rev_ED.csv' ...

An admin user with the password *password* will be created. You can create an
other user:

.. code-block:: shell

    $ python manager.py create_user firstname.lastname@mail.org name password


Install the JavaScript requirements with Bower
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Installation of node
''''''''''''''''''''

.. code-block:: shell

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


Installation of NPM
'''''''''''''''''''

.. code-block:: shell

    curl -l https://npmjs.org/install.sh | sudo sh

    npm -v # check the version


Installation of Bower
'''''''''''''''''''''

.. code-block:: shell

    npm install -g bower


Installation of our JavaScript dependencies
'''''''''''''''''''''''''''''''''''''''''''

.. code-block:: shell

    cd
    cd shelter-database/
    bower install


You can now run the application in standalone mode:

.. code-block:: shell

    $ python3.5 runserver.py
     * Running on http://0.0.0.0:5000/ (Press CTRL+C to quit)


For a production server continue with the next steps.



Deployment with Apache and mod_wsgi
-----------------------------------

Installation of Apache and mod_wsgi
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: shell

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


The WSGI file
~~~~~~~~~~~~~

Below is an example of WSGI file (**/var/www/shelter-database/webserver.wsgi**).

.. code-block:: shell

    #!/usr/bin/env python3.5

    import sys

    sys.path.insert(0, '/home/shelter/shelter-database/')

    from runserver import app as application



The VirtualHost configuration file
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Below an example for the file **/etc/apache2/sites-available/shelter-database**

.. code-block:: shell

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


Enable the site:

.. code-block:: shell

    sudo a2ensite shelter-database


The web application is now running with a dedicated user and a thread limit set
to 5.


GeoServer
"""""""""

The application `GeoServer <http://geoserver.org>`_ 2.8.4 is deployed with
Tomcat 8.0.36 and available
`here <https://shelter-database.org:8443/geoserver>`_.

Except some configurations in order to enable HTTPS no specific settings were
required. It is just needed to deploy the GeoServer WAR file in Tomcat.

Two layers are used by the Shelter Database application:

* `Köppen–Geiger climate classification system <https://shelter-database.org:8443/geoserver/shelters/wms?service=WMS&version=1.1.0&request=GetMap&layers=shelters:koeppen-geiger&styles=&bbox=-180.24500000476837,-90.2449951171875,180.2449951171875,84.22234392166138&width=768&height=371&srs=EPSG:4326&format=application/openlayers>`_;
* `Red Cross climate classification system <https://shelter-database.org:8443/geoserver/shelters/wms?service=WMS&version=1.1.0&request=GetMap&layers=shelters:redcross&styles=&bbox=-180.24500000476837,-90.2449951171875,180.2449951171875,84.22234392166138&width=768&height=371&srs=EPSG:4326&format=application/openlayers>`_.
