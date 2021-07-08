const express = require("express")
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
require('./App/DB');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
require('./App/Routes')(app);


app.get("/",(req,res)=>{
    res.json({message:"Make an API with Node.JS, MongoDB, and JWT Authentication"})
})


app.listen(port,()=>{
    console.log(`server started successfully at port ${port}`)
})