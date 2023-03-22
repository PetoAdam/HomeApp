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
    password_hash VARCHAR(256),
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


INSERT INTO Users (user_name, normalized_user_name, email, normalized_email, email_confirmed, password_hash, two_factor_enabled, lockout_end, lockout_enabled, access_failed_count) VALUES ('rasp', 'RASP', 'rasp@rasp.com', 'RASP@RASP.COM', 1, 'F8197C2208C0B2CE0E67817C6BCD95ED48E1F6AD9CE5BE4FEDEDA96E95734FCC', 0, NULL, 0, 0);
INSERT INTO Roles (name, normalized_name) VALUES ('Admin', 'ADMIN');
INSERT INTO Roles (name, normalized_name) VALUES ('User', 'USER');
INSERT INTO UserRoles (user_id, role_id) SELECT 1, (SELECT id FROM Roles WHERE name = 'Admin') FROM Users WHERE user_name = 'rasp';


