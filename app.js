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
                "Add employees",
                "Add departments",
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
                case "Add employees":
                    

                    break;

                case "Add departments":
                   
                    departmentAdd();
                    break;

                case "Add roles":
                    
                    roleAdd();
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

function departmentAdd() {
    inquirer
        .prompt({
            name:"add",
            type:"input",
            message:"Enter new department name."
        })
        .then(function(answer){
            console.log("\n Adding " + answer.add + "...\n");
            connection.query("INSERT INTO department SET ?",
                {department_name: answer.add}
            )
            dbStart();
        })
};

function roleAdd() {
    connection.query("SELECT * FROM department", function (err, res){ 
        inquirer
            .prompt([
                {
                    name:"role",
                    type:"input",
                    message:"What is the title of the role?"
                },
                {
                    name:"salary",
                    type:"input",
                    message:"What is the salary?"
                },
                {
                    name:"department",
                    type:"list",
                    choices: function() {
                        let choice = [];
                        for(let i = 0; i < res.length; i++) {
                            console.log(res[i].department_id + " = " + res[i].department_name); // Kinda ugly. Can't think of a way to make it cleaner.
                            choice.push(res[i].department_id);
                        };
                        return choice;
                    },
                    message:"Choose a department for role."
                }
            ])
            .then(function(answer){
                console.log("\n Adding " + answer.role + "...");

                connection.query("INSERT INTO role SET ?",
                    [
                        {
                            roles: answer.role,
                            salary: answer.salary,
                            department_id: answer.department
                        }
                    ],
                    function(err) {
                        if(err) throw err;
                        dbStart();
                    }
                )
            }); 
        });
};