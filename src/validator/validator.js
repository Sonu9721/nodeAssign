const mongoose = require('mongoose');

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
const isValidObjectId = (ObjectId) => {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}
const isStrictString = function (value) {
    if (typeof value !== 'string') return false
    let flag = 0 //A flag variable used as a boollean variable where the result toggles between 0(False) and 1(True)
    value = value.trim()
    for (let i = 0; i < value.length; i++)//charCode a=97 small a to z(in 97 to 122) and A=65 capital A to Z (in 65 to 90)
        if ((value.charCodeAt(i) >= 97 && value.charCodeAt(i) <= 122) || (value.charCodeAt(i) >= 65 && value.charCodeAt(i) <= 90)) flag++
    if (flag !== value.length) return false
    return true
}

const isObjectId = function (ObjectId) {
    return  mongoose.isValidObjectId(ObjectId)
    }
    const isValidEmail = function (email) {
        email = email.trim()
        let regexForEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        return regexForEmail.test(email)
    };

    const isValidPhone = function (phone) {
        phone = phone.trim()
        let regexForphone = /^(?:(?:\+|0{0,2})91(\s*|[\-])?|[0]?)?([6789]\d{2}([ -]?)\d{3}([ -]?)\d{4})$/
        return regexForphone.test(phone)
    };
    
    const isValidPassword = function (password) {
        password = password.trim()
        if (password.length > 8 && password.length < 16) return true
        return false
    }

    const isValidAddress = async function (address) {
        try {
            return await JSON.parse(address)//When receiving data from a web server, the data is always a string
        }//parse the data with JSON.parse(), and the data becomes a javascript object
        catch (err) {
            console.log(err)
            if (err) return false
        }
    }
    
    
    
    const isValidPincode = function (pincode) {
        try{
    
    
        if (typeof pincode !== 'number') return false
        pincode = `${pincode}`
    
    
        if (pincode.length !== 6) return false
        if (pincode[0] === 0) return false
    
    
        let flag = 0
        pincode = pincode.trim()
        for (let i = 1; i < pincode.length; i++)
            if ((pincode.charCodeAt(i) >= 48 && pincode.charCodeAt(i) <= 57)) flag++
    //charCode 48 to 57 means number from 0 to 9
    
        if (flag !== pincode.length-1) return false
        return true
        }
        catch(err){
            console.log(err)
        }
    }
    module.exports = { 
        isValid, 
        isValidRequestBody, 
        isValidObjectId,
        isStrictString,
        isObjectId,
        isValidEmail,
        isValidPhone,
        isValidPassword,
        isValidAddress,
        isValidPincode}