USE employees;

-- Insert sample departments
INSERT INTO department (name) VALUES
('Sales'),
('Engineering'),
('Marketing');
('Finance');
("Biology");

-- Insert sample roles
INSERT INTO role (title, salary, department_id) VALUES
('Sales Representative', 50000.00, 1),
('Software Engineer', 80000.00, 2),
('Marketing Coordinator', 45000.00, 3);
('Accountant', 60000.00, 4);
('Biologist', 70000.00, 5);



-- Insert sample employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 2, 1),
('Mike', 'Johnson', 2, 1),
('Anna', 'Davis', 3, NULL),
('Chris', 'Brown', 3, 4);
('Devin', 'Homie', 5, null)
