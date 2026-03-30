const dns = require("dns")
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express')
const { MongoClient, ServerApiVersion, Db, ObjectId } = require('mongodb');
const cors = require('cors')
const app = express()
const port = 3000
// const uri = "mongodb+srv://mustafiz8260_db_user:tcqlEbzee0oFm8F3@cluster0.llozej9.mongodb.net/?appName=Cluster0";
const uri = "mongodb+srv://mustafiz8260_db_user:8tq57oekMUGifUYG@cluster0.jq9emig.mongodb.net/?appName=Cluster0";


app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
    res.send({ message: `Server Is Running on Port , ${port}` })
})

// 8tq57oekMUGifUYG


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");


        // All api starts here

        const DB = client.db("Furniro")
        const userCollection = DB.collection("user")
        const productCollection = DB.collection("product")
        const categoryCollection = DB.collection("category")


      app.post("/user" , async (req , res )  => {
        const data = req.body

        const email = data.email

        const userEsixt = await userCollection.findOne({email : email})
        console.log(userEsixt);

        if(userEsixt){
            return res.send({message : "user already exist"})
        }

        console.log(data);

        const result = await userCollection.insertOne(data)
        res.send(result)

      })


      app.get("/user" , async (req , res) => {
        const result = await userCollection.find().toArray()
        res.send(result)
      })

      app.post("/category" , async (req , res) => {
        try {
            const data = req.body
            const response = await categoryCollection.insertOne(data)
            res.status(201).send(response)
        } catch (error) {
            res.status(400).send({message : error.message})
        }
      })


      app.get("/category" , async (req  , res) => {
        try {

            const respose = await categoryCollection.find().toArray()
            res.send(respose)
            
        } catch (error) {
            res.status(400).send({message : error.message})
        }
    })
    
    app.delete("/category/:id" , async (req , res) => {
        try {
            const id = req.params.id
            const response = await categoryCollection.deleteOne({_id : new ObjectId(id)})
            res.send(response)
        } catch (error) {
            
            res.status(400).send({message : error.message})
        }
      })


      app.post("/product" , async (req , res) => {
        const data = req.body
        const result = await productCollection.insertOne(data)
        res.send(result)
      })



    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}

run().catch(console.dir);



app.listen(port, () => {
    console.log(`Server Is Running on Port , ${port}`);
})


// tcqlEbzee0oFm8F3
// mustafiz8260_db_user