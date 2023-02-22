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
const inquirerRun = () => {
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
            case("Quit"):
        }
    })
};


// Database queries

// View Departments
function viewDepartments() {
    db.query(`SELECT * FROM departments`, function (err, results) {
        console.log(results);
        inquirerRun();
    })
};


inquirerRun();