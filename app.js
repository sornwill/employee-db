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
                "View departments",
                "View employees",
                "View roles",
                "Add departments",
                "Add employees",
                "Add roles",
                "Exit"
            ]
        })
        .then(function(answer) {
            switch (answer.menu) {
                case "View departments":
                    //View via dep
                    console.log("Department");
                    break;
                
                case "View employees":
                    //view via employees
                    console.log("Employees");
                    break;

                case "View roles":
                    //view via roles
                    console.log("Roles");
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

function depSearch(){
    inquirer
        .prompt({
            name:"department",
            type:""
        })
}