from bootstrap import db
from web.materialized_view_factory import create_mat_view

from web.models import Shelter, Property, Value, Attribute, Association
from sqlalchemy import func

#query = create_mat_view('value_lex', db.select([Property.shelter_id.label('shelter_id'),
#    func.to_tsvector(func.string_agg(Value.name,' ')).label("lexemes")]
#    ).select_from(db.join(Property, Attribute, Property.attribute_id==Attribute.id)#, isouter=True)
#    ).group_by(Property.shelter_id))

#print(query.c.shelter_id) 

class Tsvector(db.Model):
    __table__ = create_mat_view("tsvector",
    				db.select([Shelter.id.label('shelter_id'),
    				func.to_tsvector(func.string_agg(Value.name,' ')).label("lexeme")])\
    				.select_from(db.join(db.join(db.join(Shelter,Property), Association), Value))\
    				.group_by(Shelter.id, Property.shelter_id))
#                    document = db.session.query(Property.shelter_id,func.to_tsvector(func.string_agg(Value.name,' ')).label("text"))\
#    		.join(Attribute)\
#    		.join(Association,Property.id==Association.property_id)\
#    		.join(Value, Association.value_id==Value.id)\
#    		.group_by(Property.shelter_id)\
#    		.subquery()
