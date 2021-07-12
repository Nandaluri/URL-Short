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

//redirect with slug
app.get("/:slug", async(req,res) => {
    const col = client.db("Url-collection").collection("Urls");
    let response;
    try{
        response = await col.findOne({"slug": req.params.slug})
        console.log(response)
        col.updateOne({"slug": req.params.slug}, {$inc: {"clicks": 1}, $push: {"clickAddress": req.ip}})
    } catch(err){
        res.send("something went wrong")
    } finally {
        res.status(201)
        res.redirect(response.ourl)
    }
})
//
app.post("/api/short", async(req,res) => {
    const col = client.db("Url-collection").collection("Urls")
    // create new uniques slug
    const slug = await createAndCheckSlug(col)
    
    try{
        await col.insertOne({"slug": slug, "ourl": req.body.url, "clicks": 0, "clickAddress": []})
    } catch(err){
        //handle error
        res.json({"status": "error", "errorMessage": "Something went wrong"})
    } finally {
        //respond with new slug
        res.json({"status": "success", "slug": slug})
    }
})


//functions

//create unique slug
async function createAndCheckSlug(col){
    //create new slug
    let slug = uniqueSlug()
    //check if slug already exists
    const checkSlug = await col.findOne({"slug": slug})
    //return slug if unique, else try again
    if(!checkSlug){
        return slug
    } else {
        return createAndCheckSlug(col)
    }
}



app.listen(PORT,() => {
    console.log("Server started on port " + PORT)
})