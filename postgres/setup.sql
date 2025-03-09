-- Drop everything so we can make sure there are no conflicts or old data

-- Creation starts
CREATE DATABASE tank_data;

\c tank_data

CREATE SCHEMA tank_data_schema;
SET search_path TO tank_data_schema;

-- Tank table
CREATE SEQUENCE tank_id_seq;
CREATE TABLE tank(
	id INTEGER NOT NULL DEFAULT nextval('tank_id_seq') PRIMARY KEY,
	name VARCHAR(256) NOT NULL,
	apex_host VARCHAR(256)
);

-- Parameter table
CREATE SEQUENCE parameter_id_seq;
CREATE TABLE parameter(
	id INTEGER NOT NULL DEFAULT nextval('parameter_id_seq') PRIMARY KEY,
	name VARCHAR(64) NOT NULL UNIQUE,
	apex_name VARCHAR(64)
);

-- ParameterReading table
CREATE SEQUENCE parameter_reading_id_seq;
CREATE TABLE parameter_reading(
	id INTEGER NOT NULL DEFAULT nextval('parameter_reading_id_seq') PRIMARY KEY,
	tank_id BIGINT NOT NULL,
	parameter_id BIGINT NOT NULL,
	value REAL NOT NULL,
	time TIMESTAMPTZ NOT NULL,
  show_in_dashboard BOOLEAN NOT NULL DEFAULT TRUE
);

ALTER TABLE parameter_reading
	ADD CONSTRAINT parameter_reading_fkey_tank_id
		FOREIGN KEY (tank_id)
		REFERENCES tank (id);

ALTER TABLE parameter_reading
	ADD CONSTRAINT parameter_reading_fkey_parameter_id
		FOREIGN KEY (parameter_id)
		REFERENCES parameter (id);

ALTER TABLE parameter_reading
	ADD CONSTRAINT parameter_reading_time_parameter_id_unique UNIQUE (time, parameter_id);

-- Alarm table
CREATE SEQUENCE alarm_id_seq;
CREATE TABLE alarm (
  id INTEGER NOT NULL DEFAULT nextval('alarm_id_seq') PRIMARY KEY,
  name VARCHAR(256) NOT NULL,
  parameter_id BIGINT NOT NULL,
  tank_id BIGINT NOT NULL,
  high_limit DOUBLE PRECISION,
  low_limit DOUBLE PRECISION,
  severity INTEGER DEFAULT 1
);

ALTER TABLE alarm
	ADD CONSTRAINT alarm_fkey_tank_id
		FOREIGN KEY (tank_id)
		REFERENCES tank (id);

ALTER TABLE alarm
	ADD CONSTRAINT alarm_fkey_parameter_id
		FOREIGN KEY (parameter_id)
		REFERENCES parameter (id);

-- Setting permissions for our data injection script --
CREATE USER tank_data_injector;
ALTER USER tank_data_injector WITH PASSWORD 'tankDataInjector';
GRANT CONNECT ON DATABASE tank_data TO tank_data_injector;
GRANT USAGE ON SCHEMA tank_data_schema TO tank_data_injector;
GRANT SELECT, INSERT ON TABLE parameter_reading TO tank_data_injector;
GRANT USAGE ON SEQUENCE parameter_reading_id_seq TO tank_data_injector;
GRANT SELECT ON TABLE parameter TO tank_data_injector;
GRANT SELECT ON TABLE tank TO tank_data_injector;

-- Setting permission for our dashboard --
CREATE USER dashboard_user;
ALTER USER dashboard_user WITH PASSWORD 'dashboardUser';
GRANT CONNECT ON DATABASE tank_data TO dashboard_user;
GRANT USAGE ON SCHEMA tank_data_schema TO dashboard_user;
GRANT SELECT ON TABLE parameter_reading TO dashboard_user;
GRANT SELECT ON TABLE parameter TO dashboard_user;
GRANT SELECT ON TABLE tank TO dashboard_user;
GRANT SELECT ON TABLE alarm TO dashboard_user;

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
('WB 90.3', '192.168.51.10'),
('Test Tank', null);

