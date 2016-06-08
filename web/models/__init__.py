#! /usr/bin/env python
#-*- coding: utf-8 -*-

# ***** BEGIN LICENSE BLOCK *****
# This file is part of Shelter Database.
# Copyright (c) 2016
# All rights reserved.
#
#
#
# ***** END LICENSE BLOCK *****

__author__ = "Cedric Bonhomme"
__version__ = "$Revision: 0.1 $"
__date__ = "$Date: 2016/03/30$"
__revision__ = "$Date: 2016/03/30 $"
__copyright__ = "Copyright (c) "
__license__ = ""

from .user import User
from .property import Property
from .value import Value
from .shelter import Shelter

from .category import Category
from .attribute import Attribute
from .attribute_picture import AttributePicture

from .page import Page
from .translation import Translation


__all__ = ['User', 'Shelter', 'Property', 'Category', 'Attribute', 'Value',
            'Page', 'Translation', 'AttributePicture']

import os

from sqlalchemy.engine import reflection
from sqlalchemy.schema import (
        MetaData,
        Table,
        DropTable,
        ForeignKeyConstraint,
        DropConstraint)

def mappers(*args):
    from sqlalchemy.orm import class_mapper
    return [class_mapper(x) for x in args]

def uml_graph(db):
    """Generate a UML diagram from the models."""
    import sqlalchemy_schemadisplay as sasd

    graph = sasd.create_uml_graph(
                        mappers(User, Shelter, Property,
                                Category, Attribute, Value,
                                Page, Translation, AttributePicture),
                        show_operations=False,
                        show_multiplicity_one=True
    )
    graph.write_png('uml_graph.png') # write out the file

def db_empty(db):
    "Will drop every datas stocked in db."
    # From http://www.sqlalchemy.org/trac/wiki/UsageRecipes/DropEverything
    conn = db.engine.connect()

    # the transaction only applies if the DB supports
    # transactional DDL, i.e. Postgresql, MS SQL Server
    trans = conn.begin()

    inspector = reflection.Inspector.from_engine(db.engine)

    # gather all data first before dropping anything.
    # some DBs lock after things have been dropped in
    # a transaction.
    metadata = MetaData()

    tbs = []
    all_fks = []

    for table_name in inspector.get_table_names():
        fks = []
        for fk in inspector.get_foreign_keys(table_name):
            if not fk['name']:
                continue
            fks.append(ForeignKeyConstraint((), (), name=fk['name']))
        t = Table(table_name, metadata, *fks)
        tbs.append(t)
        all_fks.extend(fks)

    for fkc in all_fks:
        conn.execute(DropConstraint(fkc))

    for table in tbs:
        conn.execute(DropTable(table))

    trans.commit()

def db_create(db):
    "Will create the database from conf parameters."
    db.create_all()
