from bootstrap import db

def create_db_triggers():
    db.engine.execute(
    	"""
    	CREATE OR REPLACE FUNCTION refresh_materialized_view() RETURNS trigger AS
    	$$
    	BEGIN
    	REFRESH MATERIALIZED VIEW tsvector;
    	RETURN NULL;
    	END;
    	$$
    	LANGUAGE plpgsql;

    	CREATE TRIGGER refresh_shelter AFTER TRUNCATE OR INSERT OR UPDATE OR DELETE
    	ON shelter FOR EACH STATEMENT
    	EXECUTE PROCEDURE refresh_materialized_view();

    	CREATE TRIGGER refresh_property AFTER TRUNCATE OR INSERT OR UPDATE OR DELETE
    	ON property FOR EACH STATEMENT
    	EXECUTE PROCEDURE refresh_materialized_view();
    	
    	REFRESH MATERIALIZED VIEW tsvector
    	""")

