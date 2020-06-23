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
    let query = "SELECT first_name, last_name, role_id, manager_id FROM employee";
    connection.query(query, function(err, res){
        for (let i = 0; i < res.length; i++) {
            console.table("Name: " + res[i].first_name + " " + res[i].last_name);
            //need to get role and manager name.
        }
        dbStart();
    })
};

function departmentView(){
    let query = "SELECT department_id, department_name FROM department";
    connection.query(query, function(err, res){
        for (let i = 0; i < res.length; i++) {
            console.table(" Department("+ res[i].department_id + ") : "   + res[i].department_name);
            
        }
        dbStart();
    })
};

function roleView(){
    let query = "SELECT roles, salary FROM role";
    connection.query(query, function(err, res){
        for (let i = 0; i < res.length; i++) {
            console.table("Role : " + res[i].roles + "  Salary : " + res[i].salary);
            
        }
        dbStart();
    })
};