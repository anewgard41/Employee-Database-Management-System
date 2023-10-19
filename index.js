const { prompt } = require("inquirer");
const db = require("./db");

init();

function init() {
    loadMainPrompts();
}

function loadMainPrompts() {
    prompt([
        {
            type: "list",
            name: "choice",
            message: "How can we help you?",
            choices: [
                {
                    name: "View All Employees",
                    value: "VIEW_EMPLOYEES"
                },
                {
                    name: "View All Employees By Department",
                    value: "VIEW_EMPLOYEES_BY_DEPARTMENT"
                },
                {
                    name: "View All Employees By Manager",
                    value: "VIEW_EMPLOYEES_BY_MANAGER"
                },
                {
                    name: "Add Employee",
                    value: "ADD_EMPLOYEE"
                },
                {
                    name: "Remove Employee",
                    value: "REMOVE_EMPLOYEE"
                },
                {
                    name: "Update Employee Role",
                    value: "UPDATE_EMPLOYEE_ROLE"
                },
                {
                    name: "Update Employee Manager",
                    value: "UPDATE_EMPLOYEE_MANAGER"
                },
                {
                    name: "View All Roles",
                    value: "VIEW_ROLES"
                },
                {
                    name: "Add Role",
                    value: "ADD_ROLE"
                },
                {
                    name: "Remove Role",
                    value: "REMOVE_ROLE"
                },
                {
                    name: "View All Departments",
                    value: "VIEW_DEPARTMENTS"
                },
                {
                    name: "Add Department",
                    value: "ADD_DEPARTMENT"
                },
                {
                    name: "Remove Department",
                    value: "REMOVE_DEPARTMENT"
                },
                {
                    name: "View Department Budgets",
                    value: "VIEW_DEPARTMENT_BUDGETS"
                },
                {
                    name: "Quit",
                    value: "QUIT"
                }
            ]
        }
    ]).then(res => {
        let choice = res.choice;
        // Using switch/case, we can determine which function will be called based on what the user chooses.
        switch (choice) {
            case "VIEW_EMPLOYEES":
                viewEmployees();
                break;
            case "VIEW_EMPLOYEES_BY_DEPARTMENT":
                viewEmployeesByDepartment();
                break;
            case "VIEW_EMPLOYEES_BY_MANAGER":
                viewEmployeesByManager();
                break;
            case "ADD_EMPLOYEE":
                addEmployee();
                break;
            case "REMOVE_EMPLOYEE":
                removeEmployee();
                break;
            case "UPDATE_EMPLOYEE_ROLE":
                updateEmployeeRole();
                break;
            case "UPDATE_EMPLOYEE_MANAGER":
                updateEmployeeManager();
                break;
            case "VIEW_DEPARTMENTS":
                viewDepartments();
                break;
            case "ADD_DEPARTMENT":
                addDepartment();
                break;
            case "REMOVE_DEPARTMENT":
                removeDepartment();
                break;
            case "VIEW_ROLES":
                viewRoles();
                break;
            case "ADD_ROLE":
                addRole();
                break;
            case "REMOVE_ROLE":
                removeRole();
                break;
            case "VIEW_DEPARTMENT_BUDGETS":
                viewDepartmentBudgets();
                break;
            default:
                quit();
        }
    })
}

// For all the below functions, we use the db helper methods created in db/index.js to query the database. 
// The map method is used frequently in the below functions to create arrays of objects that can be used in the prompt method.

// View all employees in the database
function viewEmployees() {
    db.findAllEmployees()
        .then(([rows]) => {
            let employees = rows;
            console.log("\n");
            console.table(employees);
        })
        .then(() => loadMainPrompts());
}

// View all employees by department
function viewEmployeesByDepartment() {
    db.findAllDepartments()
        .then(([rows]) => {
            let departments = rows;
            const departmentChoices = departments.map(({ id, name }) => ({
                name: name,
                value: id
            }));

            prompt([
                {
                    type: "list",
                    name: "departmentId",
                    message: "Which department would you like to see employees for?",
                    choices: departmentChoices
                }
            ])
                .then(res => db.findAllEmployeesByDepartment(res.departmentId))
                .then(([rows]) => {
                    let employees = rows;
                    console.log("\n");
                    console.table(employees);
                })
                .then(() => loadMainPrompts())
        })
}

// View all employees by manager 

function viewEmployeesByManager() {
    db.findAllEmployees()
        .then(([rows]) => {
            let managers = rows;
            const managerChoices = managers.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));

            prompt([
                {
                    type: "list",
                    name: "managerId",
                    message: "Which employee do you want to see direct reports for?",
                    choices: managerChoices
                }
            ])
                // We use the findAllEmployeesByManager method to query the database and return all employees with the selected manager's id.
                .then(res => db.findAllEmployeesByManager(res.managerId))
                .then(([rows]) => {
                    let employees = rows;
                    console.log("\n");

                    // If the selected employee has no direct reports, a message will be displayed.
                    if (employees.length === 0) {
                        console.log("The selected employee has no direct reports");

                    } else {
                        console.table(employees);
                    }
                })
                .then(() => loadMainPrompts())
        })
}

// Add an employee to the database using their first and last name, then their role and manager.
function addEmployee() {
    prompt([
        {
            name: "first_name",
            message: "What is the employee's first name?"
        },
        {
            name: "last_name",
            message: "What is the employee's last name?"
        }
    ])
        .then(res => {
            let firstName = res.first_name;
            let lastName = res.last_name;

            db.findAllRoles()
                .then(([rows]) => {
                    let roles = rows;
                    const roleChoices = roles.map(({ id, title }) => ({
                        name: title,
                        value: id
                    }));

                    prompt({
                        type: "list",
                        name: "roleId",
                        message: "What is the employee's role?",
                        choices: roleChoices
                    })
                        .then(res => {
                            let roleId = res.roleId;

                            db.findAllEmployees()
                                .then(([rows]) => {
                                    let employees = rows;
                                    const managerChoices = employees.map(({ id, first_name, last_name }) => ({
                                        name: `${first_name} ${last_name}`,
                                        value: id
                                    }));
                                    
                                    // Here we add a "None" option to the managerChoices array using the unshift method, so that the user can select "None" if the employee has no manager.
                                    managerChoices.unshift({ name: "None", value: null });

                                    prompt({
                                        type: "list",
                                        name: "managerId",
                                        message: "Who is the employee's manager?",
                                        choices: managerChoices
                                    })
                                        .then(res => {
                                            let employee = {
                                                manager_id: res.managerId,
                                                role_id: roleId,
                                                first_name: firstName,
                                                last_name: lastName
                                            }

                                            db.createEmployee(employee);
                                        })
                                        .then(() => console.log(
                                            `Added ${firstName} ${lastName} to the database`
                                        ))
                                        .then(() => loadMainPrompts())
                                })
                        })
                })
        })
}

// Remove an employee from the database using their id. Using the findAllEmployees method, we can display all employees in the database, and then remove the selected employee using the removeEmployee method.
function removeEmployee() {
    db.findAllEmployees()
        .then(([rows]) => {
            let employees = rows;
            const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));

            prompt([
                {
                    type: "list",
                    name: "employeeId",
                    message: "Which employee do you want to remove?",
                    choices: employeeChoices
                }
            ])
                .then(res => db.removeEmployee(res.employeeId))
                .then(() => console.log("Removed employee from the database"))
                .then(() => loadMainPrompts())
        })
}

// Update an employee's role in the database. 
function updateEmployeeRole() {
    db.findAllEmployees()
        .then(([rows]) => {
            let employees = rows;
            const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));

            prompt([
                {
                    type: "list",
                    name: "employeeId",
                    message: "Which employee's role do you want to update?",
                    choices: employeeChoices
                }
            ])
                .then(res => {
                    let employeeId = res.employeeId;
                    db.findAllRoles()
                        .then(([rows]) => {
                            let roles = rows;
                            const roleChoices = roles.map(({ id, title }) => ({
                                name: title,
                                value: id
                            }));

                            prompt([
                                {
                                    type: "list",
                                    name: "roleId",
                                    message: "Which role do you want to assign the selected employee?",
                                    choices: roleChoices
                                }
                            ])
                                .then(res => db.updateEmployeeRole(employeeId, res.roleId))
                                .then(() => console.log("Updated employee's role"))
                                .then(() => loadMainPrompts())
                        })
                })
        })
}

// Update an employee's manager in the database.

function updateEmployeeManager() {
    db.findAllEmployees()
        .then(([rows]) => {
            let employees = rows;
            const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));

            prompt([
                {
                    type: "list",
                    name: "employeeId",
                    message: "Which employee's manager do you want to update?",
                    choices: employeeChoices
                }
            ])
                .then(res => {
                    let employeeId = res.employeeId;

                    db.findAllPossibleManagers(employeeId)
                        .then(([rows]) => {
                            let managers = rows;
                            const managerChoices = managers.map(({ id, first_name, last_name }) => ({
                                name: `${first_name} ${last_name}`,
                                value: id
                            }));

                            prompt([
                                {
                                    type: "list",
                                    name: "managerId",
                                    message: "Which employee do you want to set as manager for the selected employee?",
                                    choices: managerChoices
                                }
                            ])
                                .then(res => db.updateEmployeeManager(employeeId, res.managerId))
                                .then(() => console.log("Updated employee's manager"))
                                .then(() => loadMainPrompts())
                        })
                })
        })
}

// View all roles in the database.

function viewRoles() {
    db.findAllRoles()
        .then(([rows]) => {
            let roles = rows;
            console.log("\n");
            console.table(roles);
        })
        .then(() => loadMainPrompts());
}

// Add a role to the database. 

function addRole() {
    db.findAllDepartments()
        .then(([rows]) => {
            let departments = rows;
            const departmentChoices = departments.map(({ id, name }) => ({
                name: name,
                value: id
            }));

            prompt([
                {
                    name: "title",
                    message: "What is the name of the role?"
                },
                {
                    name: "salary",
                    message: "What is the salary of the role?"
                },
                {
                    type: "list",
                    name: "department_id",
                    message: "Which department does the role belong to?",
                    choices: departmentChoices
                }
            ])
                .then(role => {
                    db.createRole(role);
                })
                .then(() => console.log(`Added role to the database`))
                .then(() => loadMainPrompts())
        })
}

// Remove a role from the database. Using the findAllRoles method, we can display all roles in the database, and then remove the selected role using the removeRole method.

function removeRole() {
    db.findAllRoles()
        .then(([rows]) => {
            let roles = rows;
            const roleChoices = roles.map(({ id, title }) => ({
                name: title,
                value: id
            }));

            prompt([
                {
                    type: "list",
                    name: "roleId",
                    message: "Which role do you want to remove?",
                    choices: roleChoices
                }
            ])
                .then(res => db.removeRole(res.roleId))
                .then(() => console.log("Removed role from the database"))
                .then(() => loadMainPrompts())
        })
}

// View all departments in the database.

function viewDepartments() {
    db.findAllDepartments()
    .then(([rows]) => {
        let departments = rows;
        console.log("\n");
        console.table(departments);
    })
    .then(() => loadMainPrompts());
}

// Add a department to the database. This is simpler than adding a new employee, as we only need to add the name of the department, and no salary/manager information. 

function addDepartment() {
    prompt([
        {
            name: "name",
            message: "What is the name of the department?"
        }
    ])
        .then(res => {
            let name = res;
            db.createDepartment(name);
        })
        .then(() => console.log(`Added department to the database`))
        .then(() => loadMainPrompts())
}

// Remove a department from the database. Using the findAllDepartments method, we can display all departments in the database, and then remove the selected department using the removeDepartment method.

function removeDepartment() {
    db.findAllDepartments()
        .then(([rows]) => {
            let departments = rows;
            const departmentChoices = departments.map(({ id, name }) => ({
                name: name,
                value: id
            }));

            prompt([
                {
                    type: "list",
                    name: "departmentId",
                    message: "Which department do you want to remove?",
                    choices: departmentChoices
                }
            ])
                .then(res => db.removeDepartment(res.departmentId))
                .then(() => console.log("Removed department from the database"))
                .then(() => loadMainPrompts())
        })
};

// View department budget using the viewDepartmentBudgets method. The budget being the combined salaries of all employees in the department. 

function viewDepartmentBudgets() {
    db.viewDepartmentBudgets()
        .then(([rows]) => {
            let departments = rows;
            console.log("\n");
            console.table(departments);
        })
        .then(() => loadMainPrompts());
};

// Quit the application.

function quit() {
    console.log("Thanks for stopping by. Have a great day!");
    process.exit();
};


