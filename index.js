const express=require('express');
const mongoose=require('mongoose');
const router = require("./route/route");
let pdf = require("pdf-creator-node");
let fs = require("fs");
let dataStudent = require("./data/data");
var html = fs.readFileSync("index.html", "utf8");
const app=express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Forth api to send email that PDF as attachment
const nodemailer = require("nodemailer");
// userName and password created from here ==>> https://ethereal.email/
const account={
    user:"nina.ondricka85@ethereal.email",
    pass:"Fdy5VVBkmqv1SjEucJ"
}

// async..await is not allowed in global scope, must use a wrapper
//async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  //let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: account.user, // generated ethereal user
      pass: account.pass, // generated ethereal password
    },
  });

  // send mail data with unicode symble
  let mailOptions={
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
    attachments:[//send pdf to the email
        {
            filename:'output.pdf',
            path: __dirname+ '/output.pdf'
        }
    ]
  };

  //send email with defined transport object
  transporter.sendMail(mailOptions,(error,info)=>{
    if(error){
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s',nodemailer.getTestMessageUrl(info));
  });
 
///////////////////////////////////
//Creating an html template
var html = fs.readFileSync("index.html", "utf8");
//setting the parameters for the pdf file
var options = {
  format: "A3",
  orientation: "portrait",
  border: "10mm",
  header: {
    height: "45mm",
    contents: '<div style="text-align: center;">Author: Sonu Kumar Rai</div>',
  },
  footer: {
    height: "28mm",
    contents: {
      first: "Cover page",
      2: "Second page", // Any page number is working. 1-based index
      default:
        '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
      last: "Last Page",
    },
  },
};
// creating the html file with our json data
var document = {
  html: html,
  data: {
    students: dataStudent["data"]["Students"],
  },
  path: "./output.pdf",
  type: "",
};

//Second Api 
//creating a pdf with the html
app.get("/convertToPdf", async (req, res) => {
    try{
  pdf
    .create(document, options)
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.error(error);
    });
  res.send("pdf created");
} catch (error) {
    res.status(500).send({ status: false, message: error.message });
}
});


//Third Api
app.put("/editPdf", (req, res) => {
    try{
    //fetching the modification  request from the body
  let criteria = req.body;
  //modifing the pdf dynamically
  let parameter = Object.keys(criteria)[1];
  //featching the json data
  let studentData = dataStudent["data"]["Students"];
// Finding data accourding to students
  let searchedData = studentData.find(
    (student) => student["Name"] === criteria["name"]
  );
  //Modifing student data as per request
  if (parameter === "Major") {
    searchedData[parameter] = criteria[parameter];
  }
  if (parameter === "city") {
    searchedData["address"]["city"] = criteria[parameter];
  }
  if (parameter === "zip") {
    searchedData["address"]["zip"] = criteria[parameter];
  }
  if (parameter === "state") {
    searchedData["address"]["state"] = criteria[parameter];
  }
  if (parameter === "address_1") {
    searchedData["address"]["address_1"] = criteria[parameter];
  }
  if (parameter === "address_2") {
    searchedData["address"]["address_2"] = criteria[parameter];
  }

  pdf
    .create(document, options)
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.error(error);
    });
  res.send("edited");
} catch (error) {
    res.status(500).send({ status: false, message: error.message });
}
});

app.use(router);

mongoose.connect("mongodb+srv://functionup:deep982@cluster0.r0zd4.mongodb.net/BhumioAssignment", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

//app.use('/', route)

//app.listen 4000
app.listen(process.env.PORT || 5000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 5000))
});