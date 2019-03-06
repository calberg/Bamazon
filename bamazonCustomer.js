var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Jacob1031",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  showProducts();
  runSearch();
});

function showProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].dept_name + " | " + res[i].price + " | " + res[i].stock_quantity);
    }
    console.log("-----------------------------------");
  });
}

function runSearch() {
  var questions = [
    {
        message: "What is the product ID?",
        type: "input",
        name: "productId"
    },
    {
      message: "How many would you like to buy?",
      type: "input",
      name: "quantity"
    }];
  inquirer.prompt(questions);
  console.log("And your answers are:", answers);
  }
 
