const express = require("express")
const app = express()
const PORT = 5000
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://m001-student:12345@cluster0.kmj0n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(()=> {
    console.log("connected")
})
app.use(express.urlencoded({ extended: false }))
app.use(express.json())




app.listen(PORT,() => {
    console.log("Server started on port " + PORT)
})