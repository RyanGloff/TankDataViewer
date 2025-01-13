-- This should have been a real from the start. VARCHAR was a dumb idea --
ALTER TABLE tank_data_schema.parameter_reading ALTER COLUMN value TYPE REAL USING (value::real);
