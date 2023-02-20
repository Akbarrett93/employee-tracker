DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

USE company_db;

CREATE TABLE department(
    id INT NOT NULL PRIMARY KEY,
    dep_name VARCHAR(30) NOT NULL
);

CREATE TABLE role(
    id INT NOT NULL PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT REFERENCES department(id)
);

CREATE TABLE employee(
    id INT NOT NULL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT REFERENCES role(id),
    manager_id INT REFERENCES employees(id)
);