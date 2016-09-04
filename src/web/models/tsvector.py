from bootstrap import db
from web.materialized_view_factory import create_mat_view

from web.models import Shelter, Property, Value, Attribute, Association
from sqlalchemy import func


class Tsvector(db.Model):
    __table__ = create_mat_view("tsvector",
    				db.select([Shelter.id.label('shelter_id'),
    				func.to_tsvector(func.string_agg(Value.name,' ')).label("lexeme")])\
    				.select_from(db.join(db.join(db.join(Shelter,Property), Association), Value))\
    				.group_by(Shelter.id, Property.shelter_id))
