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
