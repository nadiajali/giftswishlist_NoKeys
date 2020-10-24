var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
const { response, request } = require("express");

const PORT = process.env.PORT || 3000;

// Serves up static assets. Usually on Heroku.
if (process.env.NODE_ENV === "production") {
  app.use(express.static("web/build"));
}

var db = mongoose.connect(
  "mongodb://localhost/gifts" ||
    "mongodb+srv://user:hYN8Fnfs207BL@cluster0.6g9uc.mongodb.net/gifts?retryWrites=true&w=majority"
);
var Product = require("./model/product");
var WishList = require("./model/wishlist");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.post("/product", function (req, res) {
  var product = new Product();
  product.title = req.body.title;
  product.price = req.body.price;
  product.imageURL = req.body.imageURL;
  res.setHeader("Access-Control-Allow-Origin", "*");
  product.save(function (err, savedProduct) {
    if (err) {
      res.status(500).send({
        error: "Could not save product.",
      });
    } else {
      res.send(savedProduct);
    }
  });
});

app.get("/product", function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  Product.find({}, function (err, products) {
    if (err) {
      res.status(500).send({
        error: "Could not fetch products.",
      });
    } else {
      res.send(products);
    }
  });
});

app.get("/wishlist", function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  WishList.find({})
    .populate({
      path: "products",
      model: "Product",
    })
    .exec(function (err, wishLists) {
      if (err) {
        res.status(500).send({
          error: "Could not fetch wish lists.",
        });
      } else {
        res.send(wishLists);
      }
    });
});

app.post("/wishlist", function (req, res) {
  var wishList = new WishList();
  wishList.title = req.body.title;
  res.setHeader("Access-Control-Allow-Origin", "*");
  wishList.save(function (err, newWishList) {
    if (err) {
      res.status(500).send({
        error: "Could not create wish list.",
      });
    } else {
      res.send(newWishList);
    }
  });
});

app.put("/wishlist/product/add", function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  Product.findOne(
    {
      _id: req.body.productID,
    },
    function (err, product) {
      if (err) {
        res.status(500).send({
          error: "Could not add product to wish list.",
        });
      } else {
        WishList.update(
          {
            _id: req.body.wishListID,
          },
          {
            $addToSet: {
              products: product._id,
            },
          },
          function (err, wishList) {
            if (err) {
              res.status(500).send({
                error: "Could not add product to wish list.",
              });
            } else {
              res.send("Successfully added to wish list.");
            }
          }
        );
      }
    }
  );
});
/*
var ingredients = [{
        "id": "1",
        "text": "Eggs"
    },
    {
        "id": "2",
        "text": "Milk"
    },
    {
        "id": "3",
        "text": "Bacon"
    },
    {
        "id": "4",
        "text": "Frogs Legs"
    }
];

app.get('/ingredients', function (req, res) {
    res.send(ingredients);
});

app.post('/ingredients', function (req, res) {
    var ingredient = req.body;

    if (!ingredient || ingredient.text === "") {
        res.status(500).send({
            error: "Your ingredient must have text."
        });
    } else {
        ingredients.push(ingredient);
        res.status(200).send(ingredients);
    }
});

app.put('/ingredients/:ingredientID', function (req, res) {
    var text = req.body.text;

    if (!text || text === "") {
        res.status(500).send({
            error: "You must provide ingredient text."
        });
    } else {
        var objectFound = false;
        for (var x = 0; x < ingredients.length; x++) {
            var ing = ingredients[x];
            if (ing.id === req.params.ingredientID) {
                ingredients[x].text = req.body.text;
                objectFound = true;
                break;
            }
        }
        if (!objectFound) {
            response.status(500).send({
                error: "Ingredient ID not found."
            });
        } else {
            res.send(ingredients);
        }
    }
});
*/

app.listen(3000, function () {
  console.log("Financial Gifts running on port 3000.");
});
