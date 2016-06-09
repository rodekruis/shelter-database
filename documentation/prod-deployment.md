# Deployment with Apache and mod_wsgi

## Installation of Python, Apache and mod_wsgi

    $ apt-get install build-essential libssl-dev git

    $ wget https://www.python.org/ftp/python/3.5.1/Python-3.5.1.tgz
    $ tar -xzvf Python-3.5.1.tgz
    $ rm Python-3.5.1.tgz
    $ cd Python-3.5.1/
    $ ./configure --enable-shared --with-ensurepip=install
    $ make
    $ sudo make install
    $ cd ..
    $ sudo rm -Rf Python-3.5.1/


    $ git clone https://git.list.lu/charism/shelter-database.git
    $ cd shelter-database/
    $ sudo pip install --upgrade -r requirements.txt
    $ cp conf/conf.cfg-sample conf/conf.cfg


    $ sudo apt-get install apache2 apache2-prefork-dev
    $ wget https://github.com/GrahamDumpleton/mod_wsgi/archive/4.4.13.tar.gz
    $ tar -xzvf 4.4.13.tar.gz
    $ rm 4.4.13.tar.gz
    $ cd mod_wsgi-4.4.13/
    $ ./configure --with-python=/usr/local/bin/python3.5
    $ make
    $ sudo make install
    $ cd ..
    $ sudo rm -Rf mod_wsgi-4.4.13/
    $ echo 'LoadModule wsgi_module /usr/lib/apache2/modules/mod_wsgi.so' > /etc/apache2/mods-available/wsgi.load
    $ sudo service apache2 restart
    $ sudo a2enmod wsgi

## The WSGI file

Below is an example of WSGI file (**webserver.wsgi**).

    $ cat /var/www/shelter-database/webserver.wsgi
    #!/usr/bin/env python3.5

    import sys

    sys.path.insert(0, '/home/shelter/shelter-database/')

    from runserver import app as application


## The VirtualHost configuration file

    $ cat /etc/apache2/sites-available/shelter-database
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


    $ sudo a2ensite shelter-database

The web application will be running with a dedicated user and a thread limit set
to 5.
