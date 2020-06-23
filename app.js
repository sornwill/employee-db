const inquirer = require("inquirer");
const mysql = require("mysql");
const consoleTable = require("console.table");

const connection = mysql.createConnection({
    host:"localhost",

    port:3306,

    user:"root",

    password:"22087005552493",

    database:"employee_db",
});

connection.connect(function (err) {
    if (err) throw err;
    
    dbStart();
});

function dbStart(){
    inquirer
        .prompt({
            name:"menu",
            type:"list",
            message:"Welcome to Employee DB. \n Here you will be able to search/add employees, departments, or roles.\n What would you like to do?",
            choices: [
                "View employees",
                "View departments",
                "View roles",
                "Add departments",
                "Add employees",
                "Add roles",
                "Exit"
            ]
        })
        .then(function(answer) {
            switch (answer.menu) {
                case "View employees":
                    
                    employeeView();
                    break;
                
                case "View departments":
                   
                    departmentView();
                    break;

                case "View roles":
                   
                    roleView();
                    break;
                case "Add departments":
                    //add departments
                    console.log("Add Department");
                    break;

                case "Add employees":
                    //add employees
                    console.log("Add Employee");
                    break;

                case "Add roles":
                    console.log("Add roles");
                    break;

                case "Exit":
                    connection.end();
                    break;
            };
        });
};

function employeeView(){
    let query = "SELECT employee.employee_id, employee.first_name, employee.last_name, role.roles, employee.manager_id ";
    query += "FROM employee ";
    query+= "INNER JOIN role ON employee.role_id = role.role_id";
    connection.query(query, function(err, res){
        if (err) throw err;
        console.table(res);
        dbStart();
    })
};

function departmentView(){
    let query = "SELECT * FROM department";
    connection.query(query, function(err, res){
       if (err) throw err;
       console.table(res);
        dbStart();
    })
};

function roleView(){
    let query = "SELECT * FROM role";
    connection.query(query, function(err, res){
       if (err) throw err;
       console.table(res);
        dbStart();
    })
};