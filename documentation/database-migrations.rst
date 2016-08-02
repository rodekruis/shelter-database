Database migrations
===================

Add a new migration script
--------------------------

.. code-block:: shell

    python3.5 src/manager.py db revision -m "comment about the changes"

Then edit appropriately the generated file.


Update the database to the last version
---------------------------------------

.. code-block:: shell

    python3.5 src/manager.py db upgrade


See the history of the migrations on the current database
---------------------------------------------------------

.. code-block:: shell

    python3.5 src/manager.py db history
