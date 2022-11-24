var data = require("../data/data");
let fs = require("fs");

//first Api for searching on the basis different parameters like - zip, city, name etc
let search = async function (req, res) {
    try{
    //fetching the search request from the body
  let criteria = req.body;
  //featching the json data 
  let studentData = data["data"]["Students"];
  //To search dynamacilly
  let parameter = Object.keys(criteria)[0];
  //making an empty data object
  let newData = [];
  //Search on the basis of different parameters
  if (parameter === "name") {
    newData = studentData.filter(
      (student) => student["Name"] === criteria["name"]
    );
  }
  if (parameter === "major") {
    newData = studentData.filter(
      (student) => student["Major"] === criteria["major"]
    );
  }
  if (parameter === "city") {
    newData = studentData.filter(
      (student) => student["address"]["city"] === criteria["city"]
    );
  }
  if (parameter === "zip") {
    newData = studentData.filter(
      (student) => student["address"]["zip"] === criteria["zip"]
    );
  }
  if (parameter === "state") {
    newData = studentData.filter(
      (student) => student["address"]["state"] === criteria["state"]
    );
  }
  res.json({data:newData})
} catch (error) {
    res.status(500).send({ status: false, message: error.message });
}
};


module.exports.search = search;

