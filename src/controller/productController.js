const mongoose=require('mongoose')
const productModel = require("../model/productModel")


const isValid = (value) => {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    if (typeof value === 'number' && value.toString().trim().length === 0) return false
    return true;
}
const isValidRequestBody = (requestBody) => {
    if (Object.keys(requestBody).length) return true
    return false;
}

const createproducts = async function(req, res) {

    let reqBody = req.body

    let files = req.files
    if (files && files.length > 0) {
        //upload to s3 and get the uploaded link
        // res.send the link back to frontend/postman
        let uploadedFileURL = await uploadFile(files[0])
        data.productImage = uploadedFileURL
       
    } else {
        return res.status(400).send({ message: "profile cover image not given" })
    }

    //object destructuring
    let {companyName,phone,email,address,city,pincode,productImage,productTypes,productName,price,availableSizes,quantity,features,manufacturingDetails,description}=reqBody

        if (!isValidRequestBody(reqBody)) {
            return res.status(400).send({ status: false, message: "please provide input credentials" });
        }
    
        if (!isValid(companyName)) {
            return res.status(400).send({ status: false, message: "please provide companyName credentials" });
        }
    
        if (!isValid(phone)) {
            return res.status(400).send({status: false, msg: "Enter phone no. " })
        }
    
        if (!(/^[6-9]\d{9}$/.test(phone))) {
            return res.status(400).send({ status: false, message: `Phone number should be a valid number` })
    
        }
        const isphone = await productModel.findOne( {phone} )
        if (isphone) {
            return res.status(400).send({status: false, msg: "Phone no.  is already used" })
        }
    
        if (!isValid(email)) {
            return res.status(400).send({ status: false, msg: "Enter email " })
        }
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim()))) {
            return res.status(400).send({ status: false, message: `Email should be a valid email address` })
            
        }
        const isemail = await productModel.findOne({email})
        if (isemail) {
            return res.status(400).send({status: false, msg: "Email.  is already used" })
        }
         //address---------------------------------------------------------------------------------------------------
        if (!isValid(address)) {
            return res.status(400).send({ status: false, message: "address required" })
        }

        if (!isValid(city)) {
            return res.status(400).send({ status: false, message: "city is  required" })

        }
        if (!isValid(pincode)) {
            return res.status(400).send({ status: false, message: "pincode is  required " })

        }
     
        if (!isValid(productImage)) {
            return res.status(400).send({ status: false, message: "please provide productImage credentials" });
        }        
    
     
            
        if (!isValid(productTypes)) {
            return res.status(400).send({ status: false, message: "please provide productTypes credentials" });
        }
    
        
        if (!isValid(productName)) {
            return res.status(400).send({ status: false, message: "please provide productName credentials" });
        }
    
        if (!isValid(price)) {
            return res.status(400).send({ status: false, message: "please provide price credentials" });
        }
    
        if (!isValid(availableSizes)) {
            return res.status(400).send({ status: false, message: "please provide availableSizes credentials" });
        }
    
        if (!isValid(quantity)) {
            return res.status(400).send({ status: false, message: "please provide quantity credentials" });
        }
    
        if (!isValid(features)) {
            return res.status(400).send({ status: false, message: "please provide features credentials" });
        }
    
        if (!isValid(manufacturingDetails)) {
            return res.status(400).send({ status: false, message: "please provide manufacturingDetails credentials" });
        }
    
    
        if (!isValid(description)) {
            return res.status(400).send({ status: false, message: "please provide description credentials" });
        }

   
   
    const Newproduct = await productModel.create(reqBody)
    return res.status(201).send({ status: true, message: "Product created successfully", data: Newproduct })


}
const getProductBYQuery = async function(req, res) {

    try {
        if (req.query.availableSizes || req.query.productName || req.query.priceGreaterThan || req.query.priceLessThan) {
            let availableSizes = req.query.availableSizes
            let title = req.query.productName
            let priceGreaterThan = req.query.priceGreaterThan
            let priceLessThan = req.query.priceLessThan
            obj = {}
            if (availableSizes) {
                obj.availableSizes = availableSizes
            }
            if (title) {
                obj.title = { $regex: title, $options: 'i' };//i defined case sensitive
            }
            if (priceGreaterThan) {
                obj.price = { $gt: priceGreaterThan }
            }
            if (priceLessThan) {
                obj.price = { $lt: priceLessThan }
            }
            obj.isDeleted = false
            obj.deletedAt = null

            if (req.query.sort === -1) {
                const getProductsList = await productModel.find(obj).sort({ price: -1 })

                if (!getProductsList || getProductsList.length == 0) {
                    res.status(400).send({ status: false, message: `product is not available right now.` })
                } else {
                    res.status(200).send({ status: true, message: 'Success', data: getProductsList })
                }

            } else {
                const getProductsList = await productModel.find(obj).sort({ price: 1 })

                if (!getProductsList || getProductsList.length == 0) {
                    res.status(400).send({ status: false, message: `product is not available right now.` })
                } else {
                    res.status(200).send({ status: true, message: 'Success', data: getProductsList })
                }
            }


        } else {
            if (req.query.sort === -1) {
                const getListOfProducts = await productModel.find({ isDeleted: false, deletedAt: null }).sort({ price: -1 })
                res.status(200).send({ status: true, message: 'Success', data: getListOfProducts })
            } else {
                const getListOfProducts = await productModel.find({ isDeleted: false, deletedAt: null }).sort({ price: 1 })
                res.status(200).send({ status: true, message: 'Success', data: getListOfProducts })
            }
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }

}

const getProductById = async function(req, res) {//Go to valid js for validation
    try {
        let productId = req.params.productId

        if (productId.length < 24 || productId.length > 24) {
            return res.status(400).send({ status: false, msg: "Plz Enter Valid Length Of productId in Params" });
        }

        if (!validator.isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: "please provide valid productId" });
        }

        let bData = await productModel.findById(productId);
        if (!bData) {
            return res.status(404).send({ status: false, message: "Data Not Found" });
        }

        const searchProduct = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!searchProduct) {
            return res.status(400).send({ status: false, msg: 'product does not exist with this prouct id or incorrect product id' })
        }
        res.status(200).send({ status: true, msg: 'sucess', data: searchProduct })
    } catch (err) {
        res.status(500).send({ status: false, Message: err.message })
    }
}

const updateProduct = async(req,res)=>{
      try{
         let productId = req.params.productId
        
         let product = await productModel.findOne({_id:productId,isDeleted:false})

         if(!product)    return res.status(400).send({status:false,message:"product dont exist"})


         //-----------------------------------------------------------------------------------------------------------------


         let data = req.body

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: 'no data given for updation' })
        }

        //title---------------------------------------------------------------------------------------------

        if (data.title) {
        
        const title = await productModel.findOne({ title: data.title })
        if (title) {
            return res.status(400).send({ status: false, message: "title already exists" })
        }
        product.title=data.title
    }

        //---------------------------------description ------------------------------------------------------------
        if (data.description) {
            product.description = data.description
        }

        //-----------------------------------------price--------------------------------------------------------
        if (data.price) {
        
        if(!Number.isInteger(Number(data.price)) ) {
             return res.status(400).send({ status: false, message: "price is number" })
        }
        if(Number(data.price)<=0)      return res.status(400).send({ status: false, message: "price must be greater than 0" })
      const price=await productModel.findOne({_id:productId})
      console.log(price)
        product.price = price
        console.log(price)
    }

        //------------------------------------currencyId-----------------------------------------------------------
        if(data.currencyId)  {   

        if(data.currencyId!='INR')      return res.status(400).send({ status: false, message: "currency id must be in INR" })
         
        product.currencyId = data.currencyId
        }

        //------------------------------------currency format--------------------------------------------------------
        if(data.currencyFormat)     {

        if(data.currencyFormat!='₹')      return res.status(400).send({ status: false, message: "currency format must be in ruppees" })
        product.currencyFormat=data.currencyFormat
        }
        //---------------------------------------isfreeshippinhg--------------------------------------------------
        if(data.isFreeShipping){
            if(!['true','false'].includes(data.isFreeShipping.trim())){
                return res.status(400).send({ status: false, message: "isFreeShipping must be boolean" })
            }
          product.isFreeShipping = data.isFreeShipping
        }
        //----------------------------------------image--------------------------------------------------------------
             //uploading cover photo in aws-------------------------------------------------------------------------
             let files= req.files
             if(files && files.length>0){
                 //upload to s3 and get the uploaded link
                 // res.send the link back to frontend/postman
                 let image = files[0].originalname.split(".")
                 if(!['png','jpg','pdf'].includes(image[image.length-1])){
                    return res.status(400).send({ status: false, message: "must be png , jpg and pdf" })

                 }
                 let uploadedFileURL= await uploadFile( files[0] )
                 product.productImage = uploadedFileURL
                 
         }

        //-------------------------------------------style---------------------------------------------------------
        if (data.style) {
            product.style = data.style
        }
        //------------------------------------------available sizes----------------------------------------------------
        if(data.availableSizes){
            let arr = ["S", "XS","M","X", "L","XXL", "XL"]
            let givenSizes = data.availableSizes.split(",")
    
            const contains = givenSizes.some(e => !arr.includes(e))
            
            if(contains)      return res.status(400).send({ status: false, message: 'must be ["S", "XS","M","X", "L","XXL", "XL"]' })

          
            product.availableSizes=givenSizes
        }


        //----------------------------------------installments-----------------------------
        if (data.installments) {
        
        if(!Number.isInteger(Number(data.installments))  )    return res.status(400).send({ status: false, message: "installments is number" })

        if(Number(data.installments)<=0)      return res.status(400).send({ status: false, message: "installments must be greater than 0" })

        product.installments = data.installments
        }


        product.save()
         //------------------------------------------------------------------------------------------------------------------

         return res.status(200).send({status:true,message:"product updation successful",data:product})
    }
    catch(err){
        res.status(500).send({status:false,message:err.message})
    }
}

//Product Delete

const deleteProduct = async function (req, res) {

    try {



        const productId = req.params.productId
        if (!validator.isObjectId(productId)) 
        return res.status(400).send({ status: false, msg: "you can pass only object id in path params" })


        const isProductPresent = await productModel.findById(productId)
        if (!isProductPresent)
         return res.status(404).send({ status: false, msg: "product not found" })


        if (isProductPresent.isDeleted === true) 
        return res.status(404).send({ status: false, msg: "product is already deleted" })
        const productDelete = await productModel.findByIdAndUpdate(productId,
            {
                $set: {
                    isDeleted: true,
                    deletedAt: Date.now()
                }
            }, { new: true })


        return res.status(200).send({ status: true, msg: "product deleted successfully", data: productDelete })


    }

    catch (err) {

        return res.status(500).send({ status: false, msg: err.message })

    }

}


module.exports = {createproducts,getProductBYQuery ,deleteProduct ,getProductById,updateProduct}
