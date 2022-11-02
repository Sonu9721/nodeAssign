const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const valid = require('../middileware/valid');
const authenti = require('../middileware/authentication')
const productController = require("../controller/productController");


// User Api
router.post('/register', userController.createUser)
router.post('/login', valid.validLogin, userController.userLogin)


// product api
router.post('/products', valid.validproduct, productController.createproducts)
router.get("/products", productController.getProductBYQuery)
router.get("/products/:productId", productController.getProductById);
router.put("/products/:productId", valid.updateProduct, productController.updateProduct)
router.delete('/products/:productId', productController.deleteProduct);

module.exports = router;