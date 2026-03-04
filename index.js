const express = require('express')
const { MongoClient, ServerApiVersion, Db } = require('mongodb');
const app = express()
const port = 3000
const uri = "mongodb+srv://mustafiz8260_db_user:tcqlEbzee0oFm8F3@cluster0.llozej9.mongodb.net/?appName=Cluster0";


app.use(express.json())

app.get("/", (req, res) => {
    res.send({ message: `Server Is Running on Port , ${port}` })
})



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


      app.post("/user" , async (req , res )  => {
        const data = req.body

        console.log(data);

        const result = await userCollection.insertOne(data)
        res.send(result)

      })


      app.get("/user" , async (req , res) => {
        const result = await userCollection.find().toArray()
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