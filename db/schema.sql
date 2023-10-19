DROP DATABASE IF EXISTS employees;
CREATE DATABASE employees;

USE employees;

CREATE TABLE department (
    id INT unsigned AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE role (
    id INT unsigned AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL UNSIGNED NOT NULL,
    department_id INT unsigned NOT NULL,
    -- indexing enables performance optimization when searching for values in a column. So for departmend_id, role_id, and manager_id, we create indexes. 
    INDEX dep_ind (department_id),
    -- department serves as the foreign key in the role table. 
    CONSTRAINT fk_departmentFOREIGN FOREIGN KEY (department_id) REFERENCES department (id) ON DELETE CASCADE
);

CREATE TABLE employee (
    id INT unsigned AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT unsigned NOT NULL,
    manager_id INT unsigned,
    INDEX role_ind (role_id),
    INDEX manager_ind (manager_id),
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
    -- foreign key which is the manager ID refers to the employee table itself. 
    CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee (id) ON DELETE SET NULL
);