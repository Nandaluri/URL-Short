const express = require("express")
const app = express()
const PORT = 5000
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://m001-student:12345@cluster0.kmj0n.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const uniqueSlug = require("unique-slug")

client.connect(()=> {
    console.log("connected")
})
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.get("/:slug", async(req,res) => {
    const col = client.db("Url-collection").collection("Urls");
    let response = "";
    try{
        response = await col.findOne({"slug": req.params.slug})
    } catch(err){
        console.error(err)
    } finally {
        res.redirect(response.ourl)
    }
})
app.get("/api/short", (req,res) => {
    const col = client.db("Url-collection").collection("Urls")
    let slug = uniqueSlug()
    try{
        col.insertOne({"slug": slug, "ourl": "https://www.facebook.com"})
    } catch(err){
        console.error(err)
    } finally {
        res.send("new url created")
    }
})


app.listen(PORT,() => {
    console.log("Server started on port " + PORT)
})