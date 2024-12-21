SET search_path TO tank_data_schema;

CREATE SEQUENCE device_type_id_seq;
CREATE TABLE device_type(
  id INTEGER NOT NULL DEFAULT nextval('device_type_id_seq') PRIMARY KEY,
  name VARCHAR(64) NOT NULL
);

INSERT INTO device_type(name) VALUES
('kasa_plug');

CREATE SEQUENCE device_id_seq;
CREATE TABLE device (
  id INTEGER NOT NULL DEFAULT nextval('device_id_seq') PRIMARY KEY,
  host VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  device_type_id INTEGER NOT NULL
);

ALTER TABLE device
  ADD CONSTRAINT device_fkey_device_type_id
    FOREIGN KEY (device_type_id)
    REFERENCES device_type (id);

CREATE SEQUENCE device_capability_id_seq;
CREATE TABLE device_capability(
  id INTEGER NOT NULL DEFAULT nextval('device_capability_id_seq'),
  name VARCHAR(64) NOT NULL,
  device_type_id INTEGER NOT NULL
);

ALTER TABLE device_capability
  ADD CONSTRAINT device_fkey_device_type_id
    FOREIGN KEY (device_type_id)
    REFERENCES device_type (id);

-- Add supported capabilities for each device_type here
INSERT INTO device_capability(name, device_type_id) (
  SELECT 'TURN_ON', id from tank_data_schema.device_type WHERE name = 'kasa_plug'
);
INSERT INTO device_capability(name, device_type_id) (
  SELECT 'TURN_OFF', id from tank_data_schema.device_type WHERE name = 'kasa_plug'
);
INSERT INTO device_capability(name, device_type_id) (
  SELECT 'GET_STATE', id from tank_data_schema.device_type WHERE name = 'kasa_plug'
);

\echo 'Patch_1.sql applied'
