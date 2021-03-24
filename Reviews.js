


/*
{
    reviewerid: 'userid from the JWT token',
    comment: 'quote from user',
    rating: 5
}

ObjectID, String
Comment, String
Rating, number

Reviews.js contains schema for the above information.

Option 1:
GO TO THIS LINK FOR A DECENT EXAMPLE ON HOW TO AGGREGATE FUNCTION CALLS FOR A REVIEW AND MOVIE AND RETURN THEM AS ONE OBJECT
https://gist.github.com/dineshsprabu/e6c1cf8f2ca100a8f5ae

function(callback) <-- call for movie

function(arg1,arg2,callback) <--- movie as arg1

function(AGGREGATE IT) <--- join the two objects

Option 2:

$Lookup using mongoDB as a single lookup.

https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/

From website:
db.orders.insert([
   { "_id" : 1, "item" : "almonds", "price" : 12, "quantity" : 2 },
   { "_id" : 2, "item" : "pecans", "price" : 20, "quantity" : 1 },
   { "_id" : 3  }
])

db.inventory.insert([
   { "_id" : 1, "sku" : "almonds", "description": "product 1", "instock" : 120 },
   { "_id" : 2, "sku" : "bread", "description": "product 2", "instock" : 80 },
   { "_id" : 3, "sku" : "cashews", "description": "product 3", "instock" : 60 },
   { "_id" : 4, "sku" : "pecans", "description": "product 4", "instock" : 70 },
   { "_id" : 5, "sku": null, "description": "Incomplete" },
   { "_id" : 6 }
])

The following aggregation operation on the orders collection joins the documents from orders with the documents from the inventory
collection using the fields item from the orders collection and the sku field from the inventory collection:

db.orders.aggregate([
   {
     $lookup:
       {
         from: "inventory",
         localField: "item",
         foreignField: "sku",
         as: "inventory_docs"
       }
  }
])

which returns:

{
   "_id" : 1,
   "item" : "almonds",
   "price" : 12,
   "quantity" : 2,
   "inventory_docs" : [
      { "_id" : 1, "sku" : "almonds", "description" : "product 1", "instock" : 120 }
   ]
}
{
   "_id" : 2,
   "item" : "pecans",
   "price" : 20,
   "quantity" : 1,
   "inventory_docs" : [
      { "_id" : 4, "sku" : "pecans", "description" : "product 4", "instock" : 70 }
   ]
}
{
   "_id" : 3,
   "inventory_docs" : [
      { "_id" : 5, "sku" : null, "description" : "Incomplete" },
      { "_id" : 6 }
   ]
}
 */