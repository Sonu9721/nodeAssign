let express = require("express")
let router = express.Router()
let shopController = require("../controllers/shopController")


router.get("/searchStudent",shopController.search)




module.exports = router