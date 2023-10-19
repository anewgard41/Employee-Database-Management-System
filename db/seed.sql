USE employees;

-- Insert sample departments
INSERT INTO department (name) VALUES
("Sales"),
("Engineering"),
("Marketing"),
("Finance"),
("Tech Support");

-- Insert sample roles
INSERT INTO role (title, salary, department_id) VALUES
("Sales Representative", 50000, 1),
("Software Engineer", 80000, 2),
("Marketing Coordinator", 45000, 3),
("Accountant", 60000, 4),
("IT", 70000, 5),
("Sales Intern", 20000, 1),
("Software Intern", 30000, 2),
("Marketing Intern", 20000, 3),
("Accounting Intern", 20000, 4),
("IT Intern", 20000, 5);



-- Insert sample employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
("John", "Doe", 1, NULL),
("Jane", "Smit", 2, 1),
("Mike", "Johnson", 2, 1),
("Anna", "Davis", 3, NULL),
("Chris", "Legend", 3, 4),
("Devin", "Homie", 5, NULL),
("Debra", "Bloops", 4, 1);
