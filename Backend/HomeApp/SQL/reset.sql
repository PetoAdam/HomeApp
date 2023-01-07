DROP TABLE Temperatures;
DROP TABLE Locations;
DROP TABLE Userroles;
DROP TABLE Roles;
DROP TABLE Users;

CREATE TABLE Users (
    id CHAR(36) NOT NULL,
    user_name VARCHAR(256) NOT NULL,
    normalized_user_name VARCHAR(256) NOT NULL,
    email VARCHAR(256) NULL,
    normalized_email VARCHAR(256) NULL,
    email_confirmed TINYINT(1) NOT NULL,
    password_hash VARCHAR(256) NOT NULL,
    security_stamp VARCHAR(256) NULL,
    concurrency_stamp CHAR(36) NOT NULL,
    phone_number VARCHAR(256) NULL,
    phone_number_confirmed TINYINT(1) NOT NULL,
    two_factor_enabled TINYINT(1) NOT NULL,
    lockout_end DATETIME(6) NULL,
    lockout_enabled TINYINT(1) NOT NULL,
    access_failed_count INT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE Roles (
    id CHAR(36) NOT NULL,
    name VARCHAR(256) NOT NULL,
    normalized_name VARCHAR(256) NOT NULL,
    concurrency_stamp CHAR(36) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE Userroles (
    user_id CHAR(36) NOT NULL,
    role_id CHAR(36) NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (role_id) REFERENCES Roles(id)
);

CREATE TABLE Locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    country VARCHAR(255) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    city VARCHAR(255) NOT NULL,
    street VARCHAR(255) NOT NULL,
    number VARCHAR(10) NOT NULL,
    description TEXT
);

CREATE TABLE Temperatures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    location_id INT NOT NULL,
    value INT NOT NULL,
    timestamp DATETIME NOT NULL,
    FOREIGN KEY (location_id) REFERENCES Locations(id)
);

INSERT INTO Users (id, user_name, normalized_user_name, email, normalized_email, email_confirmed, password_hash, security_stamp, concurrency_stamp, phone_number, phone_number_confirmed, two_factor_enabled, lockout_end, lockout_enabled, access_failed_count) VALUES (UUID(), 'rasp', 'RASP', 'rasp@rasp.com', 'RASP@RASP.COM', 1, '', '', '', NULL, 0, 0, NULL, 0, 0);
INSERT INTO Roles (id, name, normalized_name, concurrency_stamp) VALUES (UUID(), 'Admin', 'ADMIN', '');
INSERT INTO Userroles (user_id, role_id) SELECT id, (SELECT id FROM Roles WHERE name = 'Admin') FROM Users WHERE user_name = 'rasp';
INSERT INTO Locations (country, zip_code, city, street, number, description) VALUES ('Hungary', '1111', 'Budapest', 'Hengermalom út', '2/D', 'Lakás');


