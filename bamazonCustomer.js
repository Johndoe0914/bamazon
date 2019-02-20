var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require("cli-table3");
var connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password: "root",
    database: "bamazon"
});

connection.connect(function(err){
    if(err)console.log(err);
    console.log("Connected!");
    
    start();
    
});
function start(){
  showProducts();

  console.log("=====================================")
};




function showProducts(){
  var table = new Table({
    head:["id","product name","price","stock quantity"]
  , colWidths: [15,20,15,20]
  
  });
   connection.query(
    "SELECT * FROM products",function(err,response){
      if (err)throw err;
      for(var i = 0; i < response.length; i++){
           table.push([response[i].item_id , response[i].product_name,("$")+response[i].$price,response[i].stock_quantity+(" units")])

       
      }
      console.log(table.toString());
      console.log("=====================================")
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
        if((response[id].stock_quantity - answer.quantity) >= 0){

         connection.query(
          
          "UPDATE products SET stock_quantity = " + (response[id].stock_quantity - answer.quantity)+  " WHERE item_id =" + answer.id,          
        function(err) {
          var id = answer.id;
            if(err)throw err;  
          var totalCost = (parseFloat(response[id].$price) * parseFloat(answer.quantity)).toFixed(2);
            console.log("You have successfully purchased " + answer.quantity +' '+ response[id].product_name+ " Total price "+ totalCost);
            buyOrExit();
        })
      }
          else {
            console.log("insufficent Quantity")
            buyOrExit();
  
          }
            
});
   
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