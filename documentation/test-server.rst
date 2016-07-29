Practical information about the test server
===========================================

Tests of the application have been conducted on this server.

System configuration
--------------------

VPS
'''

* IP: 92.222.81.12;
* name of the VPS: vps288640.ovh.net;
* address of the application: https://shelter-database.org
* CPU: Intel Xeon E312xx (Sandy Bridge) - 2 cores;
* memory: 8,004 gigabytes;
* file system size: 40 gigabytes.

Software
''''''''

Debian 7, Python 3.5.1, PostgreSQL 9.1, Apache 2.2.22, mod_wsgi 4.4.13.


Security
--------

* `Fail2ban <http://www.fail2ban.org>`_ is running on the server;
* A TLS (`Let's Encrypt <https://letsencrypt.org/>`_) certificate has been
  installed with `certbot <https://certbot.eff.org/>`_. It is needed to renew
  it every 90 days with the command
  :code:`./certbot-auto renew --quiet --no-self-upgrade`.

Administration
---------------

* connection through SSH is possible with the user *shelter*.




HTTPS
-----

This section is useful in case you plan to provide a HTTPS connection to the
users of the platform.

The TLS certificate has been installed with Certbot (https://certbot.eff.org).

The command to renew it each 90 days is:

.. code-block:: shell

    ./path/to/certbot-auto renew --quiet --no-self-upgrade



To enable the new certificate for Tomcat (the GeoServer app) you will need some
extra steps:

Create a keystore for Tomcat
''''''''''''''''''''''''''''

.. code-block:: shell

    $ cp -L /etc/letsencrypt/live/shelter-database.org/fullchain.pem /home/shelter
    $ cp -L /etc/letsencrypt/live/shelter-database.org/privkey.pem /home/shelter
    $ openssl pkcs12 -export -in fullchain.pem -inkey privkey.pem -out fullchain_and_key.p12 -name tomcat


You will be asked to provide a password (called **yourPKCS12pass** in the
following). Do not forget it. You will need it for our second step.

Now that we have our PKCS12 keystore, we can use Java’s keytool to generate a
JKS from our PKCS12 file like so:

.. code-block:: shell

    $ keytool -importkeystore -deststorepass yourJKSpass -destkeypass yourKeyPass -destkeystore MyDSKeyStore.jks -srckeystore fullchain_and_key.p12 -srcstoretype PKCS12 -srcstorepass yourPKCS12pass -alias tomcat


This will give you a file called MyDSKeyStore.jks.
Now you are ready to configure Tomcat for HTTPS.

Configure Tomcat for HTTPS
''''''''''''''''''''''''''

.. code-block:: shell

    <Connector port="8443" protocol="org.apache.coyote.http11.Http11Protocol"
        URIEncoding="UTF-8" maxThreads="150" SSLEnabled="true" scheme="https"
        secure="true" clientAuth="false" sslProtocol="TLS"
        keystoreFile="/home/shelter/MyDSKeyStore.jks"
        keystorePass="yourJKSpass" keyAlias="tomcat" keyPass="yourKeyPass"/>

Restart Tomcat and access Tomcat through HTTPS:
https://shelter-database.org:8443
