const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors =  require('cors');
const httpProxy = require('http-proxy');
const app = express();
const proxyTarget = 'http://3.6.15.101:1000';
const apiProxy = httpProxy.createProxyServer({ target: proxyTarget });

//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ extended:true}));

// ***********************
//database code
//atlas server =>mongodb+srv://srjsachan:8858856132@portfolioprojects.1mx7zhr.mongodb.net/procarddbs?retryWrites=true&w=majority
mongoose.connect("mongodb+srv://srjsachan:8858856132@portfolioprojects.1mx7zhr.mongodb.net/procarddbs?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=>{
      console.log("Database is Connected");
    })
    .catch(err=>{
      console.log(err);
    });
    const ProCardScheama = {
      img:String,
      content:String,
      gitlink:String,
      title:String,
    }
    const ProCardDB = mongoose.model("ProCardDB",ProCardScheama);
// ************************   
app.get("/insertproject" ,(req,res)=>{
    res.sendFile(__dirname + "/index.html");
}) 
app.get("/api/data",(req,res)=>{
    ProCardDB.find({})
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Error fetching data from the database" });
    });
})
app.post("/insertproject",(req,res)=>{
    const items = new ProCardDB({
        img:req.body.imglink,
        content:req.body.content,
        gitlink:req.body.gitlink,
        title:req.body.title,
  
      });
      items.save()
      .then(()=>{
        console.log("inserted in database");
        res.send("successfully inserted in Database");
      })
      .catch(err=>{
        console.log(err);
      });
      

});
app.all('/api/data', (req, res) => {
  apiProxy.web(req, res); // Forward the request to the HTTP API
});

    
app.listen("1000", ()=>{
    console.log("Server is Running on Port: 1000");
});