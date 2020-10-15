const express = require("express");

//setting the express router , an express packge that gives us cabailty to react to different routes
const router = express.Router();

const mongoose = require("mongoose");

const Product = require("../models/product");

const checkAuth = require("../middleware/check-auth");

const Order = require("../models/order");

router.get("/",checkAuth, (req, res, next) => {
  Order.find()
    .select("_id product quantity")
    .populate('product','_id price name')
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            orderId: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: "GET",
              url: "http://localhost:3000/orders/" + doc._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

router.post("/",checkAuth, (req, res, next) => {
  Product.findById(req.body.productId)
    .select("quantity _id product")
    .exec()
    .then((product) => {
      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      });
      return order.save();
    })
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Order stored",
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity,
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/orders/" + result._id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:orderId",checkAuth, (req, res, next) => {
  Order.findById(req.params.orderId).select('product quantity _id')
   .populate('product','_id price name')
    .exec()
    .then((ord) => {
      if(!ord){
        return res.status(404).json({
          message : "Cannot find the product"
        })
      }
      res.status(200).json({
        order: ord,
        request: {
          type: "GET",
          url: "http://localhost:3000/orders" + ord._id,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        message: " Error getting the order by id",
      });
    });
});

router.delete("/:orderId", checkAuth,(req, res, next) => {
  Order.remove({_id : req.params.orderId}).exec()
  .then(result => {
    if(!result){
      res.status(404).json({
        error : "Product Not Found"
      })
    }
    res.status(200).json({
      message: "Orders deleted",
    });
  }).catch( err => {
    res.status(500).json({
      error : err
    })
  })
});

module.exports = router;
