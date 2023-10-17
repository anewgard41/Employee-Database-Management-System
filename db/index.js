const connection = require("./connection");

class DB { 
    // Maintaining a reference to the connection in the event that we need it later.  
    constructor(connection) {
        this.connection = connection;
    }


// Find all employees then join with roles and departments in order to display their roles, salaries, departments, and managers. 
findAllEmployees() {
    return this.connection.promise().query(
        "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
    );
}

// find all employees except the given employee id. 
findAllPossibleManagers(employeeId) {
    return this.connection.promise().query(
        "SELECT id, first_name, last_name FROM employee WHERE id != ?",
        employeeId
    );
    }

// Create a new employee using INSERT INTO and the values passed in as properties of employee.
createEmployee(employee) {
    return this.connection.promise().query("INSERT INTO employee SET ?", employee);
}

// Remove an employee with the given id.
removeEmployee(employeeId) {
    return this.connection.promise().query(
        "DELETE FROM employee WHERE id = ?",
        employeeId
    );
}

// Update the given employee's role using UPDATE SET WHERE.
updateEmployeeRole(employeeId, roleId) {
    return this.connection.promise().query(
        "UPDATE employee SET role_id = ? WHERE id = ?",
        [roleId, employeeId]
    );
}

// Update the given employee's manager using UPDATE SET WHERE.
updateEmployeeManager(employeeId, managerId) {
    return this.connection.promise().query(
        "UPDATE employee SET manager_id = ? WHERE id = ?",
        [managerId, employeeId]
    );
}

// Find all roles, join with departments to display the department name



}