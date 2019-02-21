// require inquirer
var inquirer = require("inquirer");
// require mysql
var mysql = require("mysql");
// require table
var Table = require("cli-table3");
// mysql connection
var connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password: "root",
    database: "bamazon"
});

connection.connect(function(err){
    if(err)console.log(err);
    // making sure ware connected
    console.log("Connected!");
    
    start();
    
});
// function that starts the code
function start(){
  showProducts();

  console.log("=====================================")
};



// function to show database products
function showProducts(){
  var table = new Table({
    head:["id","product name","price","stock quantity"]
  , colWidths: [15,20,15,20]
  
  });
  //querying all products 
   connection.query(
    "SELECT * FROM products",function(err,response){
      if (err)throw err;
      // looping through the database and logging products to the table 
      for(var i = 0; i < response.length; i++){
           table.push([response[i].item_id , response[i].product_name,("$")+response[i].$price,response[i].stock_quantity+(" units")])

       
      }
      console.log(table.toString());
      console.log("=====================================")
      // Asking the user for input
    inquirer.prompt([
        {
            type: "input",
            name: "id",
            message: "Type the id of product you would like to purchase."
        },
        {
            type: "input",
            name: "quantity",
            message: "How many units would you like to buy?",
            validate: function(value) {
              if(isNaN(value) === false) {
                return true;
              }
              return false;
            }
        },

    ]).then(function(answer){
    
        console.log("Updating store...\n");
        var id = answer.id
        // checking to see if there enough quantity to fulfill order
        if((response[id].stock_quantity - answer.quantity) >= 0){

         connection.query(
        //  if enough products update store
          "UPDATE products SET stock_quantity = " + (response[id].stock_quantity - answer.quantity)+  " WHERE item_id =" + answer.id,          
        function(err) {
          var id = answer.id;
            if(err)throw err;  
            // multiplying price with quantity for final price
          var totalCost = (parseFloat(response[id].$price) * parseFloat(answer.quantity)).toFixed(2);
            console.log("You have successfully purchased " + answer.quantity +' '+ response[id].product_name+ " Total price "+ totalCost);
            buyOrExit();
        })
      } // else 
          else {
            console.log("insufficent Quantity")
            buyOrExit();
  
          }
            
});
   // function for user to exit
        function buyOrExit(){
          inquirer
          .prompt([
            {
              type: "list",
              name: "buyorexit",
              message: "Would you like to buy another product?",
              choices: ["YES","NO"]

            }
          ]).then(function(answer){
            if(answer.buyorexit === "YES"){
              start();
            }else{
              exit();
            }
          })
        };

      })};
      function exit(){
        connection.end();
      };