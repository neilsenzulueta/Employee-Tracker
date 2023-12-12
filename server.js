// Packages required for this pplication.
const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

// Dontenv to load variables from .env file.
require('dotenv').config();

// Setting up MySQL connection.
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'employees_db',
});

// Connection to MySQL database.
connection.connect(err => {
    if (err) throw err;
    console.log("Employee Manager");
    mainMenu();
});

// Function to display main menu.
const mainMenu = () => {
    inquirer.prompt({
        message: 'What would you like to do today?',
        name: 'menu',
        type: 'list',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role'],
    })
    .then(choices => {
        switch (choices.menu){
            case 'View all departments':
                viewDepartment();
                break;
            case 'View all roles':
                viewRoles();
                break;
            case 'View all employees':
                viewEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            default: connection.end();
        }
    });
};

// Function to view department database.
const viewDepartment = () => {
    connection.query('SELECT * FROM department', function (err,res) {
        if (err) throw err;
        console.table(res);
        mainMenu();
    });
};

// Function to view roles database.
const viewRoles = () => {
    connection.query('SELECT * FROM role', function (err,res) {
        if (err) throw err;
        console.table(res);
        mainMenu();
    });
};

// Function to view employees database.
const viewEmployees = () => {
    connection.query('SELECT * FROM employee', function (err,res) {
        if (err) throw err;
        console.table(res);
        mainMenu();
    });
};

// Function to add new department to database.
const addDepartment = () => {
    inquirer.prompt([
        {
            name: 'department',
            type: 'input',
            message: 'What is the name of the department?'
        },
    ])
    .then(responses => {
        connection.query('INSERT INTO department (dept_name) VALUES (?)',
        [responses.department], function (err,res) {
            if (err) throw err;
            console.log(`Added ${responses.department} to the database`);
            mainMenu();
        });
    });
};

// Function to add new role to database.
const addRole = () => {
    inquirer.prompt([
        {
            name: 'roleTitle',
            type: 'input',
            message: 'What is the name of the role?',
        },
        {
            name: 'roleSalary',
            type: 'input',
            message: 'What is the salary of the role?',
        },
        {
            name: 'deptID',
            type: 'input',
            message: 'What is the department ID number?',
        },
    ])
    .then(responses => {
        connection.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)',
        [responses.roleTitle, responses.roleSalary, responses.deptID], function (err,res) {
            if (err) throw err;
            console.log(`Added ${responses.roleTitle} to database`);
            mainMenu();
        });
    });
};

// Function to add new employee to database.
const addEmployee = () => {
    inquirer.prompt([
        {
            name: 'first',
            type: 'input',
            message: "What is the employee's first name?",
        },
        {
            name: 'last',
            type: 'input',
            message: "What is the employee's last name?",
        },
        {
            name: 'roleID',
            type: 'input',
            message: "What is the employee's role ID?",
        },
        {
            name: 'managerID',
            type: 'input',
            message: "What is the employee's manager ID?",
        },
    ])
    .then(responses => {
        connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
        [responses.first, responses.last, responses.roleID, responses.managerID], function (err,res) {
            if (err) throw err;
            console.log(`Added ${responses.first} ${responses.last} to database`);
            mainMenu();
        });
    });
};

// Function to update current employee role to database.
const updateEmployeeRole = () => {
    inquirer.prompt([
        {
            name: 'roleID',
            type: 'input',
            message: 'Enter employee id',
        },
        {
            name: 'ID',
            type: 'input',
            message: 'Enter updated/new role ID',
        },
    ])
    .then(responses => {
        connection.query('UPDATE employee SET role_id=? WHERE id=?',
        [responses.ID, responses.roleID], function (err,res) {
            if (err) throw err;
            console.log("Updated employee's role");
            mainMenu();
        });
    });
};