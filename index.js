// Require inquirer and mysql
const inquirer = require("inquirer");
const mysql = require("mysql2");

// Connect to the database
const db = mysql.createConnection(
    {
    host: "localhost",
    user: "root",
    // Enter password here
    password: "12345",
    database: "company_db"
    },
    console.log("Connected to the company_db database.")
);

// Inquirer to initiate application
function inquirerRun() {
    inquirer.prompt([
        {
            type: "list",
            name: "menu",
            message: "What would you like to do?",
            choices: ["View Departments", "View Roles", "View Employees", "Add a department", "Add a role", "Add an employee", "Update employee role", "Quit"]
        }
    ])
    .then(answers => {
        switch (answers.menu) {
            case("View Departments"):
            viewDepartments();
            break;

            case("View Roles"):
            viewRoles();
            break;

            case("View Employees"):
            viewEmployees();
            break;

            case("Add a department"):
            addDepartment();
            break;

            case("Add a role"):
            addRole();
            break;

            case("Add an employee"):
            addEmployee();
            break;

            case("Update employee role"):
            updateEmployee();
            break;

            case("Quit"):
            db.end();
            break;
        }
    }) 
};


// Database queries

// View tables
function viewDepartments() {
    db.query(`SELECT * FROM departments`, function (err, results) {
        console.table(results);
        inquirerRun();
    })
};

function viewRoles() {
    db.query(`SELECT * FROM roles`, function (err, results) {
        console.table(results);
        inquirerRun();
    })
};

function viewEmployees() {
    db.query(`SELECT employees.first_name, 
                employees.last_name, 
                roles.title, 
                departments.dep_name AS department, 
                roles.salary, 
                CONCAT (manager.first_name, " ", manager.last_name) AS manager
            FROM employees 
                LEFT JOIN roles ON employees.role_id = roles.id
                LEFT JOIN departments ON roles.department_id = departments.id
                LEFT JOIN employees manager ON employees.manager_id = manager.id`, function (err, results) {
        console.table(results);
        inquirerRun();
    })
};

// Adding to tables
function addDepartment() {
    inquirer.prompt([
            {
                type: 'input',
                name: 'newDept',
                message: 'What would you like to call the new department?',
                validate: deptInput => {
                    if (deptInput) {
                        return true;
                    } else {
                        console.log("Please prove a name for the department");
                        return false;
                    }
                }
            }
        ])
        .then(answers => {
            db.query("INSERT INTO departments (dep_name) VALUES (?)", [answers.newDept], function (err, results) {
                if (err) throw err;
                inquirerRun();
            })
        })
};

function addRole() {
        inquirer.prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'What is the title?',
                    validate: titleInput => {
                        if (titleInput) {
                            return true;
                        } else {
                            console.log("Every role must have a title.");
                            return false;
                        }
                    }
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'What is the salary for the position?',
                    validate: salInput => {
                        if (salInput) {
                            return true;
                        } else {
                            console.log("Every position must have a salary.");
                            return false;
                        }
                    }
                },
            ])
            .then(answer => {
                // Adding the role to a department
                const params = [answer.title, answer.salary];
                db.query(`SELECT * FROM departments`, (err, data) => {
                  if (err) throw err;
                  const dept = data.map(({ id, dep_name }) => ({ value: id, name: dep_name }));
                  inquirer.prompt([
                  {
                    type: 'list', 
                    name: 'roleDep',
                    message: "What department is this role in?",
                    choices: dept
                  }
                  ])
                    .then(answer => {
                      params.push(answer.roleDep);
                      db.query(`INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`, params, (err, result) => {
                        if (err) throw err;
                        inquirerRun();
                 });
            });
        })
    })
};

function addEmployee() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'first',
            message: 'What is the employees first name?',
            validate: firstInput => {
                if (firstInput) {
                    return true;
                } else {
                    console.log("Every employee must have a name.");
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'last',
            message: 'What is the employees last name?',
            validate: lastInput => {
                if (lastInput) {
                    return true;
                } else {
                    console.log("Every employee must have a name.");
                    return false;
                }
            }
        }
    ])
    .then(answers => {
        // Adding a role to the employee
        let params = [answers.first, answers.last];
        db.query(`SELECT * FROM roles`, (err, data) => {
            if (err) throw err;
            const role = data.map(({ id, title }) => ({ value: id, name: title }));
            inquirer.prompt([
            {
                type: 'list',
                name: 'roleTitle',
                message: 'What role will they fill?',
                choices: role
            }
            ])
            .then (answer => {
                // Adding a manager if any
                params.push(answer.roleTitle);
                db.query(`SELECT * FROM employees`, (err, data) => {
                    if (err) throw err;
                    const manager = data.map(({ id, first_name, last_name }) => ({value: id, name: (first_name + " " + last_name)}));
                    inquirer.prompt([
                        {
                            type: 'confirm',
                            name: 'mngConfirm',
                            message: 'Will they report to someone?',
                            default: false,
                        },
                        {
                            type: 'list',
                            name: 'mngName',
                            message: 'Who is their manager?',
                            choices: manager,
                            when: ({mngConfirm}) => {
                                if (mngConfirm) {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                        }
                    ])
                    .then(answer => {
                        // Adding info to database
                        params.push(answer.mngName);
                        db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, params, (err, result) => {
                            if (err) throw err;
                            inquirerRun();
                        })
                    })
                })
            })
            
        })
    })
};

function updateEmployee(){
    // Listing employees to update
    db.query(`SELECT * FROM employees`, function (err, data) {
        if (err) throw err;
        let empArray = data.map(({ id, first_name, last_name }) => ({value: id, name: (first_name + " " + last_name)}));
        inquirer.prompt([
            {
                type: 'list',
                name: 'empSelect',
                message: 'Which employee do you want to update?',
                choices: empArray
            }
        ])
        .then(answer => {
            // Listing what roles to give
            let params = [];
            const employee = answer.empSelect;
            params.push(employee);
            db.query(`SELECT * FROM roles`, function (err, data) {
                if (err) throw err;
                const roleArray = data.map(({ id, title }) => ({ value: id, name: title }));
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'roleSelect',
                        message: 'What roles are they moving to?',
                        choices: roleArray
                    }
                ])
                // Adding info to the database
                .then(answer => {
                    const role = answer.roleSelect
                    params.push(role);
                    // Arranging array for query
                    let employee = params[0]
                    params[0] = role
                    params[1] = employee
                    db.query(`UPDATE employees SET role_id = ? WHERE id = ?`, params, (err, result) => {
                        if (err) throw err;
                        inquirerRun();
                    })
                })
            })
        })
    })
}

inquirerRun();