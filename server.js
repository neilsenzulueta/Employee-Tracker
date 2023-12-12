const mysql = require('mysql2');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

require('dotenv').config();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'employees_db',
});

connection.connect(err => {
    if (err) throw err;
    console.log("Employee Manager");
    mainMenu();
});

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

const viewDepartment = () => {
    connection.query('SELECT * FROM department', function (err,res) {
        if (err) throw err;
        console.table(res);
        mainMenu();
    });
};

const viewRoles = () => {
    connection.query('SELECT * FROM role', function (err,res) {
        if (err) throw err;
        console.table(res);
        mainMenu();
    });
};

const viewEmployees = () => {
    connection.query('SELECT * FROM employee', function (err,res) {
        if (err) throw err;
        console.table(res);
        mainMenu();
    });
};

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






/*User Story
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business
Acceptance Criteria
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database
*/