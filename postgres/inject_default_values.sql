SET search_path TO tank_data_schema;

INSERT INTO parameter(name, apex_name) VALUES
('temperature', 'temp'),
('ph', 'ph'),
('alkalinity', 'alk'),
('calcium', 'calc'),
('magnesium', 'mag'),
('nitrate', null),
('phosphate', null),
('alkalinity-dosing', null),
('calcium-dosing', null),
('magnesium-dosing', null);

INSERT INTO tank(name, apex_host) VALUES
('WB 90.3', '192.168.50.80'),
('Test Tank', null);

INSERT INTO parameter_reading(tank_id, parameter_id, value, time) VALUES
(1, 1, 120, now()),
(1, 2, 130, now());
