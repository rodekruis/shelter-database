<<<<<<< HEAD
<<<<<<< HEAD
API v0.1
========

Request parameters:

* **attribute**: pass one or more attribute names, such as `<attribute=Name,Vegetation>`
	NOTE: Currently the attribute names may contain capital letters and spaces.
	Spaces should be substituted as `<%20>` int the URL, for example
	`<Climate%20Zone>`. An alternative "coding-friendly" attribute naming will be implemented shortly,
	as unique strings for each attribute whithout spaces and upper case letters.	
* **format**: use `<format=prettytext>` to get the nicely formatted attribute names in the JSON,
	instead of the "coding-friendly" attribute names.
	

Examples
--------

.. code-block:: shell
    
    http://0.0.0.0:5000/api/v0.1
    # Welcome message and version info
    
    http://0.0.0.0:5000/api/v0.1/shelters
    # Get all shelters and their attributes
    
    http://0.0.0.0:5000/api/v0.1/shelters/3
    # Get a specific shelter via shelter ID
    
    http://0.0.0.0:5000/api/v0.1/shelters?attribute=Vegetation
    # Get all shelters which have an atttribute value for "Vegetation"
    
    http://0.0.0.0:5000/api/v0.1/shelters?attribute=vegetation&format=prettytext
    # Get all shelters which have an atttribute value for "Vegetation", with  nicely formatted attribute names
    
    http://0.0.0.0:5000/api/v0.1/attributes/Climate zone
    # Get all available values of an attribute
    
    http://0.0.0.0:5000/api/v0.1/shelters/Kitchen type
    #get all shelters which have a specific attribute
    
    http://0.0.0.0:5000/api/v0.1/shelters/Kitchen type/open fire
    #get all shelters which have a specific attribute value
=======
=======
>>>>>>> 56b170c62373521aae3518c6fece0335e0e06ec5
Web Services
============

Usage of the development API v0.1
---------------------------------
request parameters:
	**attribute**: pass one or more attribute names, such as `<attribute=Name,Vegetation>`
	NOTE: Currently the attribute names may contain capital letters and spaces.
	Spaces should be substituted as `<%20>` int the URL, for example
	`<Climate%20Zone>`. An alternative "coding-friendly" attribute naming will be implemented shortly,
	as unique strings for each attribute whithout spaces and upper case letters.
	
	**format**: use `<format=prettytext>` to get the nicely formatted attribute names in the JSON,
	instead of the "coding-friendly" attribute names.
	

Examples:

.. code-block:: shell
    
    http://0.0.0.0:5000/api/v0.1
    # Welcome message and version info
    
    http://0.0.0.0:5000/api/v0.1/shelters
    # Get all shelters and their attributes
    
    http://0.0.0.0:5000/api/v0.1/shelters/3
    # Get a specific shelter via shelter ID
    
    http://0.0.0.0:5000/api/v0.1/shelters?attribute=Vegetation
    # Get all shelters which have an atttribute value for "Vegetation"
    
    http://0.0.0.0:5000/api/v0.1/shelters?attribute=vegetation&format=prettytext
    # Get all shelters which have an atttribute value for "Vegetation", with  nicely formatted attribute names
    
    http://0.0.0.0:5000/api/v0.1/attributes/Climate zone
    # Get all available values of an attribute
    
    http://0.0.0.0:5000/api/v0.1/shelters/Kitchen type
    #get all shelters which have a specific attribute
    
    http://0.0.0.0:5000/api/v0.1/shelters/Kitchen type/open fire
    #get all shelters which have a specific attribute value
<<<<<<< HEAD
>>>>>>> 011351c71fefe44d232b84497307f51ee6d5b501
=======
>>>>>>> 56b170c62373521aae3518c6fece0335e0e06ec5
