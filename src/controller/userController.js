const bcrypt = require('bcrypt')
const { uploadFile } = require("../awsFile/aws")
const mongoose = require('mongoose')
const validator=require("../validator/validator")
const jwt = require("jsonwebtoken");
const userModel=require("../model/userModel")
const isValid = (value) => {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    if (typeof value === 'number' && value.toString().trim().length === 0) return false
    return true;
}

//User Registration

const createUser = async function(req, res) {
       // try {

        let data = req.body
     
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "body is required" })
        }


        if (!isValid(data.fname)) {
            return res.status(400).send({ status: false, msg: "Enter FirstName " })
        }

        if (!isValid(data.lname)) {
            return res.status(400).send({ status: false, msg: "Enter LastName " })
        }
        if (!isValid(data.email)) {
            return res.status(400).send({ status: false, msg: "Enter email " })
        }
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email.trim()))) {
            return res.status(400).send({ status: false, message: `Email should be a valid email address` })

        }
        const isemail = await userModel.findOne({ email: data.email })
        if (isemail) {
            return res.status(400).send({ status: false, msg: "Email.  is already used" })
        }

       
        if (!isValid(data.phone)) {
            return res.status(400).send({ status: false, msg: "Enter phone Number " })
        }

        if (!(/^[6-9]\d{9}$/.test(data.phone))) {
            return res.status(400).send({ status: false, message: `Phone number should be a valid number` })

        }

        const isphone = await userModel.findOne({ phone: data.phone })
        if (isphone) {
            return res.status(400).send({ status: false, msg: "Phone no.  is already used" })
        }

        if (!isValid(data.password.trim())) {
            return res.status(400).send({ status: false, msg: "Enter Password " })
        }
        if (!/^[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(data.password.trim())) {
            return res.status(400).send({ status: false, msg: "password length Min.8 - Max. 15" })
            
        }

    const salt = await bcrypt.genSalt(10);//sonu@1234
    const passwordhash=await bcrypt.hash(data.password,salt)
    data.password=passwordhash
    console.log(passwordhash)

        //address---------------------------------------------------------------------------------------------------
        if (!data.address) {
            return res.status(400).send({ status: false, message: "address required" })
        }
        let userAdd = JSON.parse(data.address)//parse convert the string data into object with help of parse
        console.log(userAdd)
        //---------------------------------------------------------------------
        if (!userAdd.street ) {
            return res.status(400).send({ status: false, message: "street is  required " })

        }
        if (!userAdd.city) {
            return res.status(400).send({ status: false, message: "city is  required" })

        }
        if (!userAdd.pincode) {
            return res.status(400).send({ status: false, message: "pincode is  required " })

        }

        data.address = userAdd
        console.log(data.address)

        //uploading cover photo in aws-------------------------------------------------------------------------
        let files = req.files
        if (files && files.length > 0) {
            //upload to s3 and get the uploaded link
            // res.send the link back to frontend/postman
            let uploadedFileURL = await uploadFile(files[0])
            data.profileImage = uploadedFileURL
            console.log(2)
        } else {
            return res.status(400).send({ message: "profile cover image not given" })
        }



        // //create user--------------------------------------------------------------------------------------------------
        const Newuser = await userModel.create(data)
        return res.status(201).send({ status: true, message: "User created successfully", data: Newuser })

    }
    // catch (error) {
    //     return res.status(500).send(error.message)
    // }
//}


const userLogin=async function (req,res){
    try{
    let data=req.body


  let findUser = await userModel.findOne({ email:data.email})
  console.log(findUser)
      if (!findUser) return res.status(404).send({ status: false, message: "email  is incorrect" })  
      
      const passwordDecrept=await bcrypt.compare(data.password, findUser.password)
      console.log(passwordDecrept)
      if (!passwordDecrept) return res.status(400).send({ status: false, message: " password is incorrect" })  
     
        const userID = findUser._id;
        const payLoad = { userId: userID };
        const secretKey = "userp51";
        const token = jwt.sign(payLoad, secretKey, { expiresIn: "10h" });

  
      res.status(200).send({ status: true, message: "User login successfully", data: { userID: findUser._id, token: token } })
    }catch (err) {
      res.status(500).send({ status: false, error: err.message })
    }
  
  }





module.exports = { createUser, userLogin}


