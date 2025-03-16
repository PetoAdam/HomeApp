DROP TABLE Measurements;
DROP TABLE Devices;
DROP TABLE Locations;

CREATE TABLE Locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    x INT,
    y INT,
    description TEXT
);

CREATE TABLE Devices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    zigbee2mqtt_id VARCHAR(255),
    ip VARCHAR(255),
    location_id INT NOT NULL,
    FOREIGN KEY (location_id) REFERENCES Locations(id)
);

CREATE TABLE Measurements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_id INT NOT NULL,
    data JSON,
    timestamp DATETIME NOT NULL,
    FOREIGN KEY (device_id) REFERENCES Devices(id)
);

INSERT INTO Locations (x, y, description) VALUES (30, 30, 'Nappali');
INSERT INTO Devices (name, zigbee2mqtt_id, ip, location_id) VALUES ('testdevice', 'testzigbee2mqttid', 'unknown', 1);
INSERT INTO Measurements (device_id, data, timestamp) VALUES (1, '{"battery":100,"humidity":44.23,"linkquality":49,"temperature":28,"voltage":3000}', '1998-01-23 12:45:56');
