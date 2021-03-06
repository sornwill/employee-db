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
            message:"Welcome to Employee DB. \n Here you will be able to view/add/remove employees, departments, or roles.\n What would you like to do?",
            choices: [
                "View employees",
                "View departments",
                "View roles",
                "Add employees",
                "Add departments",
                "Add roles",
                "Update employee roles",
                "Remove employee",
                "Remove department",
                "Remove role",
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
                    
                    employeeAdd();
                    break;

                case "Add departments":
                   
                    departmentAdd();
                    break;

                case "Add roles":
                    
                    roleAdd();
                    break;

                case "Update employee roles":

                    employeeRoleUpdate();
                    break;

                case "Remove employee":

                    removeEmp();
                    break;

                case "Remove department":

                    removeDep();
                    break;
                
                case "Remove role":

                    removeRole();
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
                            choice.push(res[i].department_id);
                        };
                        console.table(res); // Not ideal. Can't figure out how to make names display instead of number but then return id.
                        return choice;
                    },
                    message:"Choose a department for role. Choose # according to department name."
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

function employeeAdd() { // needs work with JOINS
    connection.query("SELECT * FROM role", function (err, res){ 
        inquirer
            .prompt([
                {
                    name:"first",
                    type:"input",
                    message:"What is the employee's first name?"
                },
                {
                    name:"last",
                    type:"input",
                    message:"What is the employee's last name??"
                },
                {
                    name:"role",
                    type:"list",
                    choices: function() {
                        let choice = [];
                        for(let i = 0; i < res.length; i++) {
                            choice.push(res[i].role_id);
                        };
                        console.table(res); // Not ideal. Can't figure out how to make names display instead of number but then return id.
                        return choice;
                    },
                    message:"Choose role id for employee. Choose # according to role."
                },
                {
                    name:"manager",
                    type:"list",
                    choices: [1],
                    message:"Who is in charge of employee? Choose # according to person in charge."
                }
            ])
            .then(function(answer){
                console.log("\n Adding " + answer.first + " " + answer.last + "...");

                connection.query("INSERT INTO employee SET ?",
                    [
                        {
                            first_name: answer.first,
                            last_name: answer.last,
                            role_id: answer.role,
                            manager_id: answer.manager
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

function employeeRoleUpdate(){ // WANT choose a selection of employees name THEN choose a selection of existing roles THEN UPDATE role to existing employee.
    connection.query("SELECT * FROM role", function(err, res){

        inquirer
            .prompt([
                {
                    name:"first",
                    type:"input",
                    message:"Enter the first name of the employee you wish to update."
                },
                {
                    name:"last",
                    type:"input",
                    message:"Enter the last name of the employee you wish to update."
                },
                {
                    name: "role",
                    type: "list",
                    choices: function() {
                        let choice = [];
                        for(let i = 0; i < res.length; i++) {
                            choice.push(res[i].role_id);
                        };
                        console.table(res); // Not ideal. Can't figure out how to make names display instead of number but then return id.
                     return choice;
                },
                    message:"Choose a role you wish to update. Choose # according to role."
                }
            ]).then(function(answer) {
                connection.query("UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ?",
                [answer.role, answer.first, answer.last],
                function(err){
                    if(err) throw err;
                    dbStart();
                })
            })
    })
};

function removeEmp(){
    connection.query("SELECT * FROM employee", function(err,res){
        inquirer
            .prompt([
                {
                    name:"first",
                    type:"list",
                    choices: function(){
                        let choice = [];
                        for(let i = 0; i < res.length; i++){
                            choice.push(res[i].first_name);
                        };
                        
                        return choice;
                    },
                    message: "Select first name of employee you wish to remove."
                }
            ])
            .then(function(answer){
                connection.query("DELETE FROM employee WHERE first_name = ? ",
                [answer.first],
                function(err){
                    if (err) throw err;
                    dbStart();
                });
            });
    });
};

function removeDep(){
    connection.query("SELECT * FROM department", function(err,res){
        inquirer
            .prompt([
                {
                    name:"dep",
                    type:"list",
                    choices: function(){
                        let choice = [];
                        for(let i = 0; i < res.length; i++){
                            choice.push(res[i].department_name);
                        };
                      
                        return choice;
                    },
                    message: "Select department you wish to remove."
                }
            ])
            .then(function(answer){
                connection.query("DELETE FROM department WHERE department_name = ? ",
                [answer.dep],
                function(err){
                    if (err) throw err;
                    dbStart();
                });
            });
    });
};

function removeRole(){
    connection.query("SELECT * FROM role", function(err,res){
        inquirer
            .prompt([
                {
                    name:"role",
                    type:"list",
                    choices: function(){
                        let choice = [];
                        for(let i = 0; i < res.length; i++){
                            choice.push(res[i].roles);
                        };
                      
                        return choice;
                    },
                    message: "Select role you wish to remove."
                }
            ])
            .then(function(answer){
                connection.query("DELETE FROM role WHERE roles = ? ",
                [answer.role],
                function(err){
                    if (err) throw err;
                    dbStart();
                });
            });
    });
};

