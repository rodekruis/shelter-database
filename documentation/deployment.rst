Deployment
==========

Shelter Database
""""""""""""""""

This procedure details the deployment of the application under Apache.

Tested with the following configurations:

* Debian 7, Python 3.5.1, PostgreSQL 9.1, Apache 2.2.22, mod_wsgi 4.4.13;
* Debian 8, Python 3.5.1, PostgreSQL 9.4, Apache 2.4.10, mod_wsgi 4.4.13;
* Ubuntu 16.04, Python 3.5.1+, PostgreSQL 9.5.3, Apache 2.4.18, mod_wsgi 4.4.13.
* Ubuntu 14.04, Python 3.5.1+, PostgresSQL 9.3.13, Apache 2.4.18, mod_wsgi 4.4.13



Standalone installation
-----------------------

First we install the application for a simple standalone mode.

Installation of Python
~~~~~~~~~~~~~~~~~~~~~~

First install
[pyenv](https://github.com/pyenv/pyenv),
then [pipsi](https://github.com/mitsuhiko/pipsi), and finally
[pew](https://github.com/berdario/pew) and
[pipenv](https://github.com/pypa/pipenv) with pipsi.



Install and configure the database
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: shell

    sudo apt-get install postgresql npm
    ./create_db.sh shelter pgsqluser pgsqlpwd

Set Rights to database
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Edit your pg_hba.conf and add the name of the database, in this case 'shelter'

.. code-bock:: shell

   local   shelter     pgsqluser                               trust
   host    shelter     all             127.0.0.1/32            trust
   host    shelter     all             ::1/128                 trust

.. code-bock:: shell

   sudo service postgresql restart


Retrieve the application *Shelter Database*
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: shell

    sudo apt-get install git
	cd TO YOUR APACHE WWW DIRECTORY FOR THIS INSTANCE
	git clone https://github.com/rodekruis/shelter-database.git .
    npm install
    pipenv install
    pipenv shell
    cp src/conf/conf.cfg-sample src/conf/conf.cfg

Initialization of the database
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: shell

    chmod +x init_db.sh
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

    $ python src/manager.py create_user firstname.lastname@mail.org name password


You can now run the application in standalone mode:

.. code-block:: shell

    $ python3.5 src/runserver.py
     * Running on http://0.0.0.0:5000/ (Press CTRL+C to quit)


For a production server continue with the next steps.



Deployment with Apache and mod_wsgi
-----------------------------------

Installation of apache2 dev
-----------------------------------

.. code-block:: shell

    sudo apt-get install apache2-prefork-dev

Installation of mod_wsgi
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. code-block:: shell

    wget https://github.com/GrahamDumpleton/mod_wsgi/archive/4.4.13.tar.gz
    tar -xzvf 4.4.13.tar.gz
    rm 4.4.13.tar.gz
    cd mod_wsgi-4.4.13/
    ./configure --with-python=/usr/bin/python3.5
    make
    sudo make install
    cd ..
    sudo rm -Rf mod_wsgi-4.4.13/
    echo 'LoadModule wsgi_module /usr/lib/apache2/modules/mod_wsgi.so' > /etc/apache2/mods-available/wsgi.load
    sudo service apache2 restart
    sudo a2enmod wsgi

To fix errors you can try:

.. code-block:: shell

   ln -s /usr/bin/sw-engine-cgi /var/www/cgi-bin/cgi_wrapper/cgi_wrapper

   a2dismod python for conflicts with mod_wsgi


To fix plesk:

.. code-block:: shell

   sh <(curl http://autoinstall.plesk.com/plesk-installer || wget -O - http://autoinstall.plesk.com/plesk-installer)

The Geoserver
~~~~~~~~~~~~~

The application `GeoServer <http://geoserver.org>`_ 2.8.4 is deployed with
Tomcat 8.0.36 and available
`here <https://shelter-database.org:8443/geoserver>`_.

.. code-block:: shell

   sudo apt-get install openjdk-7-jre
   sudo apt-get install tomcat7

Now we enable SSL

.. code-block:: shell

   keytool -genkey -alias tomcat7 -keyalg RSA
   (follow instructions)

   cp ~/.keystore /etc/tomcat7

Configuring Tomcat to use the Keystore. pen the Apache Tomcat server configuration on /etc/tomcat7/server.xml and find the https configuration like lines below :

.. code-block:: shell

   nano /etc/tomcat7/server.xml

   add the following under the existing commented out connector for SSL. Make sure to change the keystorepassword and set the maxThreads to 200 * number of CPU cores
   <Connector SSLEnabled="true" acceptCount="100" clientAuth="false" disableUploadTimeout="true" enableLookups="false" maxThreads="25" port="8444" keystoreFile="/etc/tomcat7/.keystore" keystorePass="verysecretpassword" protocol="org.apache.coyote.http11.Http11NioProtocol" scheme="https" secure="true" sslProtocol="TLS" />

   nano /etc/default/tomcat7

   in JAVA_OPTS you should set a higher value for the maximum heap size (xmx) for example -Xmx1024m (depending on the ressources available and the expected load) instead of the initial 128. Also you should add the initial heap size parameter (xms) and set it's value to the same one as xsx, e.g. -Xms1024m

Now let's restart tomcat 7 to reload the configuration.

.. code-block:: shell
   sudo service tomcat7 restart

Download and install Geoserver

.. code-block:: shell

   wget http://sourceforge.net/projects/geoserver/files/GeoServer/2.8.4/geoserver-2.8.4-war.zip
   unzip geoserver-2.8.4-war.zip
   cp geoserver.war /var/lib/tomcat7/webapps
   sudo service tomcat7 restart

Change the config in the shelter-database to match the domain:

.. code-block:: shell

   nano conf/conf.cfg
   change the value of 'geoserver_url' to https://[URL]:8443 and replace [URL] with your server url.

Except some configurations in order to enable HTTPS no specific settings were required. It is just needed to deploy the GeoServer WAR file in Tomcat.

Two layers are used by the Shelter Database application:

* `Köppen–Geiger climate classification system <https://shelter-database.org:8443/geoserver/shelters/wms?service=WMS&version=1.1.0&request=GetMap&layers=shelters:koeppen-geiger&styles=&bbox=-180.24500000476837,-90.2449951171875,180.2449951171875,84.22234392166138&width=768&height=371&srs=EPSG:4326&format=application/openlayers>`_;
* `Red Cross climate classification system <https://shelter-database.org:8443/geoserver/shelters/wms?service=WMS&version=1.1.0&request=GetMap&layers=shelters:redcross&styles=&bbox=-180.24500000476837,-90.2449951171875,180.2449951171875,84.22234392166138&width=768&height=371&srs=EPSG:4326&format=application/openlayers>`_.


The WSGI file
~~~~~~~~~~~~~

Below is an example of WSGI file (**/var/www/shelter-database/webserver.wsgi**).

.. code-block:: shell

    #!/usr/bin/env python3.5

    import sys

    sys.path.insert(0, '/home/shelter/shelter-database/src/')

    from runserver import app as application

Note: make sure there are no tabs/spaces preceding the

The VirtualHost configuration file
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Below an example for the file **/etc/apache2/sites-available/shelter-database**

.. code-block:: shell

    <VirtualHost [YOUR-IP]:443>
        LogLevel info
        ServerName "shelter-database.humanitariandata.nl:443"
        ServerAdmin webmaster@humanitariandata.nl

        DocumentRoot /var/www/vhosts/humanitariandata.nl/shelter-database
        CustomLog /var/www/vhosts/system/shelter-database.humanitariandata.nl/logs/access_log plesklog
        ErrorLog "/var/www/vhosts/system/shelter-database.humanitariandata.nl/logs/error_log"

		#Alias /robots.txt /var/www/vhosts/humanitariandata.nl/shelter-database/robots.txt
		#Alias /favicon.ico /var/www/vhosts/humanitariandata.nl/shelter-database/favicon.ico

        WSGIDaemonProcess shelterdatabasessl user=www-data group=www-data threads=5 display-name=%{GROUP}
        WSGIScriptAlias / /var/www/vhosts/humanitariandata.nl/shelter-database/webserver.wsgi
        <Directory /var/www/vhost/humanitariandata.nl/shelter-database>
            WSGIApplicationGroup %{GLOBAL}
            WSGIProcessGroup shelterdatabasessl
            WSGIPassAuthorization On

            Options Indexes FollowSymLinks
            Order deny,allow
            Allow from all
            IndexOptions FancyIndexing
        </Directory>

        <Proxy *>
           Order allow,deny
           Allow from all
        </Proxy>

        SSLProxyEngine On
        SSLProxyCheckPeerCN on
        SSLProxyCheckPeerExpire on
        ProxyPreserveHost On
        ProxyPass /geoserver https://shelter-database.humanitariandata.nl:8080/geoserver
        ProxyPassReverse /geoserver https://shelter-database.humanitariandata.nl:8080/geoserver
    </VirtualHost>

     <VirtualHost 85.214.236.120:80>
        LogLevel info
        ServerName "shelter-database.humanitariandata.nl:80"
        ServerAdmin webmaster@humanitariandata.nl

        DocumentRoot /var/www/vhosts/humanitariandata.nl/shelter-database
        CustomLog /var/www/vhosts/system/shelter-database.humanitariandata.nl/logs/access_log plesklog
        ErrorLog "/var/www/vhosts/system/shelter-database.humanitariandata.nl/logs/error_log"

        #Alias /robots.txt /var/www/vhosts/humanitariandata.nl/shelter-database/robots.txt
        #Alias /favicon.ico /var/www/vhosts/humanitariandata.nl/shelter-database/favicon.ico

        WSGIDaemonProcess shelterdatabase user=www-data group=www-data threads=5 display-name=%{GROUP}
        WSGIScriptAlias / /var/www/vhosts/humanitariandata.nl/shelter-database/webserver.wsgi
        <Directory /var/www/vhost/humanitariandata.nl/shelter-database>
            WSGIApplicationGroup %{GLOBAL}
            WSGIProcessGroup shelterdatabase
            WSGIPassAuthorization On

            Options Indexes FollowSymLinks
            Order deny,allow
            Allow from all
            IndexOptions FancyIndexing
        </Directory>

        <Proxy *>
           Order allow,deny
           Allow from all
        </Proxy>

        ProxyPreserveHost On
        ProxyPass /geoserver http://shelter-database.humanitariandata.nl:8080/geoserver
		ProxyPassReverse /geoserver http://shelter-database.humanitariandata.nl:8080/geoserver
    </VirtualHost>


Enable the site:

.. code-block:: shell

    sudo a2ensite shelter-database

Set rights on directories:

.. code-block:: shell

    cd shelter-database/
	sudo mkdir src/web/static/assets
	chown -R www-data:www-data src/web/static/assets
	sudo mkdir src/web/static/.webassets-cache
	chown -R www-data:www-data src/web/static/.webassets-cache


The web application is now running with a dedicated user and a thread limit set
to 5.

Update stylesheets
"""""""""

.. code-block:: shell

	## Build CSS

	Install [node-sass](https://github.com/sass/node-sass)

		$ cd your/dev/directory
		$ npm install -g node-sass

	Run node-sass

		$ cd shelter-database
		$ node-sass -w src/web/static/scss/style.scss src/web/static/css/style_new.css

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
