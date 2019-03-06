var mysql = require("mysql");
var inquirer = require("inquirer");
availableproducts =[];

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
  console.log("connected as id " + connection.threadId + "\n");
  showProducts();
});

function showProducts() {
  connection.query("SELECT * FROM products WHERE stock_quantity>0;", function(err, res) {
    for (var i = 0; i < res.length; i++) {
      availableproducts.push(res[i].product_name);
      console.log(i+1 + ".) " + res[i].item_id + " | " + res[i].product_name + " | " + res[i].dept_name + " | " + res[i].price + " | " + res[i].stock_quantity);
    };
    promptQuestion();
  });
};

function promptQuestion() {
  inquirer.prompt({
        message: "Which product would you like to buy?",
        type: "list",
        name: "nameofProduct",
        choices: availableproducts
    }).then(checkStock)
  }
    
function checkStock(answer){
    var productname = answer.nameofProduct;
    var query = "SELECT stock_quantity, price FROM products WHERE ?"
    connection.query(query, {product_name: answer.nameofProduct}, function(err, res) {
      if (err) throw err;
      var price = res[0].price;
      if (res[0].stock_quantity >0) {
        promptUserAmount(res[0].stock_quantity, price, productname);
      }
    });
  }
function promptUserAmount(itemamount, price, productname){
  inquirer.prompt({
    message: "How many would you like to buy?",
    type: "input",
    name: "amountPurchase"
  }).then(function (action) {handleAmount(action, itemamount, price, productname);});
  }

function handleAmount(answer, itemamount, price, productname){
  console.log("Price: " + price);
  if (answer.amountPurchase > itemamount) {
    console.log("sorry, we don't have enough of that item. We have " + itemamount + " of that item.");
    promptUserAmount(productname);
  }
  if (answer.amountPurchase <= itemamount) {
    var totalPurchaseCost = price * answer.amountPurchase
    var newQuantity = itemamount - answer.amountPurchase
    console.log("Total cost: " + totalPurchaseCost);
    updateProduct(newQuantity, productname);
  }
}

function updateProduct(newQuantity, productname) {
  connection.query("UPDATE products SET ? WHERE ?",
  [
    {
      stock_quantity: newQuantity
    },
    {
      product_name: productname
    }
  ],
  function(err) {
    if (err) throw err;
  });
  purchaseQuestion2(productname);
}

function purchaseQuestion2(productname){
  inquirer.prompt({
    name: "anotherPurchase",
    type: "confirm",
    message: "Thank you for your purchase of " +productname + "! Would you like to make another purchase?",
  }).then(function (action) {handleAnswer(action);})
}

function handleAnswer(action){
  if (action.anotherPurchase){
    promptQuestion();
  }
  if (!action.anotherPurchase){
    console.log("Have a good day!")
    connection.end();
  }
}
