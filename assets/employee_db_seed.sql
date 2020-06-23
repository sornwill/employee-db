DROP DATABASE IF EXISTS employee_db;

CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department (
	department_id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(45) NOT NULL
);

CREATE TABLE role (
	role_id INT AUTO_INCREMENT PRIMARY KEY,
    roles VARCHAR(45) NOT NULL,
    salary DECIMAL(15,2) NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(department_id)
);

CREATE TABLE employee (
	employee_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(45) NOT NULL,
    last_name VARCHAR(45) NOT NULL,
    role_id INT NOT NULL,
	manager_id INT NULL,
    FOREIGN KEY (role_id) REFERENCES role(role_id),
    FOREIGN KEY (manager_id) REFERENCES employee(employee_id)
);

#PREPOPULATE 

INSERT INTO department (department_name)
VALUES ("Human Resources"), ("IT"), ("Logistics"), ("Sales");

INSERT INTO role (roles, salary, department_id)
VALUES ("IT Lead", 90000.00, 2), ("Customer Service Rep", 35000.00, 4), ("Logistics Lead", 120000, 3), ("HR LADY", 75000, 1);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Bob", "Ross", 1), ("Hugo", "The Dude", 3), ("Young", "Man", 2), ("The", "Lady", 4);

SELECT * FROM employee;
