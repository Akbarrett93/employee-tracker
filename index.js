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

            case("Quit"):
        }
    })
};


// Database queries

// View tables
function viewDepartments() {
    db.query(`SELECT * FROM departments`, function (err, results) {
        console.log(results);
        inquirerRun();
    })
};

function viewRoles() {
    db.query(`SELECT * FROM roles`, function (err, results) {
        console.log(results);
        inquirerRun();
    })
};

function viewEmployees() {
    db.query(`SELECT * FROM employees`, function (err, results) {
        console.log(results);
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

inquirerRun();