SET search_path TO tank_data_schema;

CREATE SEQUENCE device_type_id_seq;
CREATE TABLE device_type(
  id INTEGER NOT NULL DEFAULT nextval('device_type_id_seq') PRIMARY KEY,
  name VARCHAR(64) NOT NULL
);

INSERT INTO device_type(name) VALUES
('simple_plug');

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

\echo 'Patch_1.sql applied'
