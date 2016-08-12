# materialized_view_factory.py
from sqlalchemy.ext import compiler
from sqlalchemy.schema import DDLElement
 
from bootstrap import db
 
 
class CreateMaterializedView(DDLElement):
    def __init__(self, name, selectable):
    	self.name = name
    	self.selectable = selectable
 
@compiler.compiles(CreateMaterializedView)
def compile(element, compiler, **kw):
    # Could use "CREATE OR REPLACE MATERIALIZED VIEW..."
    # but I'd rather have noisy errors
    return 'CREATE MATERIALIZED VIEW {} AS {}'.format(
    	element.name,
    	compiler.sql_compiler.process(element.selectable, literal_binds=True))
 
 
def create_mat_view(name, selectable, metadata=db.metadata):
    """Creates a materialized view table"""
    _mt = db.MetaData() # temp metadata just for initial Table object creation
    t = db.Table(name, _mt) # the actual mat view class is bound to db.metadata
    for c in selectable.c:
    	t.append_column(db.Column(c.name, c.type, primary_key=c.primary_key))
 
    db.event.listen(
    	metadata, 'after_create',
    	CreateMaterializedView(name, selectable)
    )
 
    db.event.listen(
    	metadata, 'before_drop',
    	db.DDL('DROP MATERIALIZED VIEW IF EXISTS ' + name)
    )
    return t
