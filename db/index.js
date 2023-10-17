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
    findAllRoles() {
        return this.connection.promise().query(
            "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;"
        );
    }

    // Create a new role using INSERT INTO and the values passed in as properties of role.
    createRole(role) {
        return this.connection.promise().query("INSERT INTO role SET ?", role);
    }

    // Remove a role from the db using the given id.
    removeRole(roleId) {
        return this.connection.promise().query("DELETE FROM role WHERE id = ?", roleId);
    }

    // Find all departments 
    findAllDepartments() {
        return this.connection.promise().query(
            "SELECT department.id, department.name FROM department;"
        );
    }

    // Find all departments, join with employees and roles and sum up utilized department budget by using GROUP BY and SUM.
    viewDepartmentBudgets() {
        return this.connection.promise().query(
            "SELECT department.id, department.name, SUM(role.salary) AS utilized_budget FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id GROUP BY department.id, department.name;"
        );
    }

    // Create a new department using INSERT INTO and the values passed in as properties of department.
    createDepartment(department) {
        return this.connection.promise().query("INSERT INTO department SET ?", department);
    }

    // Remove a department using the given id.
    removeDepartment(departmentId) {
        return this.connection.promise().query(
            "DELETE FROM department WHERE id = ?",
            departmentId
        );
    }

    // Find all employees in a given department, join with roles to display role titles
    findAllEmployeesByDepartment(departmentId) {
        return this.connection.promise().query(
            "SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id WHERE department.id = ?;",
            departmentId
        );
    }

    // Find all employees by manager, join with departments and roles to display titles and department names using LEFT JOIN. 
    findAllEmployeesByManager(managerId) {
        return this.connection.promise().query(
            "SELECT employee.id, employee.first_name, employee.last_name, department.name AS department, role.title FROM employee LEFT JOIN role on role.id = employee.role_id LEFT JOIN department on department.id = role.department_id WHERE manager_id = ?;",
            managerId
        );
    }
}

module.exports = new DB(connection);