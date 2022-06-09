// require modules
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const path = require("path");
const { response } = require("express");

// initialize express
const app = express();

// app.use
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

// GET

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname+"/signup.html"))
})

// POST

app.post("/", function(req, res){
    const firstname = req.body.fname;
    const lastname = req.body.lname;
    const email = req.body.email;

    // mailchimp format to capture members
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname
                }
            }
        ]
    } 

    // convert the capture data to JSON
    const jsonData = JSON.stringify(data);

    // url, options, function
    const url = "https://us8.api.mailchimp.com/3.0/lists/a81d7fed7c"

    const options = {
        method: "POST",
        auth: "Akshay:07c7299f79c01ca72d3602bc1e6ff0c9-us8"
    }

    const request = https.request(url, options, function(response) {
        
        // status code 200 -> Success page
        if (response.statusCode === 200) {
            res.sendFile(path.join(__dirname, "/success.html"));
        }
        else {
            res.sendFile(path.join(__dirname, "/failure.html"));
        }

        // capture response and parse the data from object to JSON
        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    })

    // write the captured request to mailchimp data format
    request.write(jsonData);
    request.end();

})

// listen to port
const port = process.env.port || 3000;
app.listen(port, () => console.log(`Server started at port: ${port}`))