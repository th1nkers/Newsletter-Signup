const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const app = express();
const port = process.env.PORT;

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))

app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/signup.html")
})

app.post("/", (req,res)=>{

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email; 

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    };    

    const jsonData = JSON.stringify(data);
    const url = "https://us21.api.mailchimp.com/3.0/lists/df4a66226a";
    const options = {
        method: "POST",
        auth: "thinkerssss:8e35b2fa15c843cbd218384ceb400720-us21"
    }

    const request = https.request(url, options, (response)=>{

        if(response.statusCode === 2000) {
            res.sendFile(__dirname + "/success.html")
        }else{
            res.sendFile(__dirname + "/failure.html")
        }

        response.on("data", (data)=>{
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
})

app.listen(port || 3000,()=>{
    console.log("Listening to " + port)
})

app.post("/failure", (req,res)=>{
    res.redirect("/")
    console.log("hey")
})


// API Key
// 5cdda831a64db52dcb93c1d1ebefa626-us21