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
        console.log(req.ip)
        col.updateOne({"slug": req.params.slug}, {$inc: {"clicks": 1}, $push: {"clickAddress": req.ip}})
    } catch(err){
        console.error(err)
    } finally {
        res.redirect(response.ourl)
    }
})
//
app.post("/api/short", async(req,res) => {
    const col = client.db("Url-collection").collection("Urls")
    // create new uniques slug
    const slug = await createAndCheckSlug(col)
    
    try{
        await checkForValidUrl(req.body.url, res)
        await col.insertOne({"slug": slug, "ourl": req.body.url, "clicks": 0, "clickAddress": []})
    } catch(err){
        //handle error
        console.error(err)
        res.send("Something went wrong")
    } finally {
        //respond with new short url
        res.json("localhost:" + PORT + "/" + slug)
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

//check if url is valid
async function checkForValidUrl(url, res){
    try{
        new URL(url)
    } catch(err){
        res.send("url not valid. Check for spelling mistakes")
    }
    return true
}


app.listen(PORT,() => {
    console.log("Server started on port " + PORT)
})