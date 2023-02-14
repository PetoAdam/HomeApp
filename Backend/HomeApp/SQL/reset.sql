DROP TABLE Temperatures;
DROP TABLE Locations;
DROP TABLE UserRoles;
DROP TABLE Roles;
DROP TABLE Users;

CREATE TABLE Users (
    id INT NOT NULL AUTO_INCREMENT,
    user_name VARCHAR(256) NOT NULL,
    normalized_user_name VARCHAR(256) NOT NULL,
    email VARCHAR(256) NULL,
    normalized_email VARCHAR(256) NULL,
    email_confirmed TINYINT(1) NOT NULL,
    two_factor_enabled TINYINT(1) NOT NULL,
    lockout_end DATETIME(6) NULL,
    lockout_enabled TINYINT(1) NOT NULL,
    access_failed_count INT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE Roles (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(256) NOT NULL,
    normalized_name VARCHAR(256) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE UserRoles (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    role_id INT NOT NULL,
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

INSERT INTO Users (user_name, normalized_user_name, email, normalized_email, email_confirmed, two_factor_enabled, lockout_end, lockout_enabled, access_failed_count) VALUES ('rasp', 'RASP', 'rasp@rasp.com', 'RASP@RASP.COM', 1, 0, NULL, 0, 0);
INSERT INTO Roles (name, normalized_name) VALUES ('Admin', 'ADMIN');
INSERT INTO Roles (name, normalized_name) VALUES ('User', 'USER');
INSERT INTO UserRoles (user_id, role_id) SELECT 1, (SELECT id FROM Roles WHERE name = 'Admin') FROM Users WHERE user_name = 'rasp';
INSERT INTO Locations (country, zip_code, city, street, number, description) VALUES ('Hungary', '1111', 'Budapest', 'Hengermalom út', '2/D', 'Lakás');


