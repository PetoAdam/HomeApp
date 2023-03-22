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
    zigbee2mqtt_id VARCHAR(255) NOT NULL,
    location_id INT NOT NULL,
    FOREIGN KEY (location_id) REFERENCES Locations(id)
);

CREATE TABLE Measurements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    device_id INT NOT NULL,
    temperature DOUBLE,
    humidity DOUBLE,
    battery INT,
    signal_strength INT,
    timestamp DATETIME NOT NULL,
    FOREIGN KEY (device_id) REFERENCES Devices(id)
);

INSERT INTO Locations (x, y, description) VALUES (30, 30, 'Nappali');
INSERT INTO Devices (name, zigbee2mqtt_id, location_id) VALUES ('testdevice', 'testzigbee2mqttid', 1);
INSERT INTO Measurements (device_id, temperature, humidity, battery, signal_strength, timestamp) VALUES (1, 23, 30, 70, 50, '1998-01-23 12:45:56');


