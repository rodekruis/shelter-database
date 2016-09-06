PDF generation
==============

If you want to enable the generation of PDF you will need to install the
following requirements.

Requirements
------------

.. code-block:: shell

    sudo apt-get install libxml2-dev libxslt-dev libcairo-dev libffi-dev libpango1.0-dev

    # to include JPEG images in PDF files
    sudo apt-get install libgdk-pixbuf2.0-dev

    sudo pip3.5 install cairocffi weasyprint
