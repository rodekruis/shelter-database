Web Services
============

Usage of the development API v0.1
---------------------------------

.. code-block:: shell
    
    http://0.0.0.0:5000/api/v0.1
    # Welcome message and version info
    
    http://0.0.0.0:5000/api/v0.1/shelters
    # Get all shelters and their attributes
    
    http://0.0.0.0:5000/api/v0.1/shelters/3
    # Get a specific shelter via shelter ID
    
    http://0.0.0.0:5000/api/v0.1/attributes/Climate zone
    # Get all available values of an attribute
