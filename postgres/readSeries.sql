SELECT NULLIF(pr.value, '')::real as ph, pr.time FROM tank_data_schema.parameter_reading as pr
FULL OUTER JOIN tank_data_schema.parameter as p ON p.id = pr.parameter_id
WHERE p.name = 'ph'
ORDER BY pr.time;
