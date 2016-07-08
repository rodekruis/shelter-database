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
