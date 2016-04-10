#! /usr/bin/python
#-*- coding:utf-8 -*

import csv

from web import models
from bootstrap import db

def init_db():
    print("Importing base structure of shelters...")
    with open('data/Shelters_Structure.csv', newline='') as csvfile:
