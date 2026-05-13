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
        const wishlistCollection = DB.collection("wishlist")
        const cartCollection = DB.collection("cart")


        app.post("/user", async (req, res) => {
            const data = req.body

            const email = data.email

            const userEsixt = await userCollection.findOne({ email: email })
            console.log(userEsixt);

            if (userEsixt) {
                return res.send({ message: "user already exist" })
            }

            console.log(data);

            const result = await userCollection.insertOne(data)
            res.send(result)

        })


        app.get("/user", async (req, res) => {
            const result = await userCollection.find().toArray()
            res.send(result)
        })

        app.post("/category", async (req, res) => {
            try {
                const data = req.body
                const response = await categoryCollection.insertOne(data)
                res.status(201).send(response)
            } catch (error) {
                res.status(400).send({ message: error.message })
            }
        })


        app.get("/category", async (req, res) => {
            try {

                const respose = await categoryCollection.find().toArray()
                res.send(respose)

            } catch (error) {
                res.status(400).send({ message: error.message })
            }
        })

        app.delete("/category/:id", async (req, res) => {
            try {
                const id = req.params.id
                const response = await categoryCollection.deleteOne({ _id: new ObjectId(id) })
                res.send(response)
            } catch (error) {

                res.status(400).send({ message: error.message })
            }
        })


        app.post("/product", async (req, res) => {
            const data = req.body
            const result = await productCollection.insertOne(data)
            res.send(result)
        })



        app.get("/product", async (req, res) => {
            try {

                const respose = await productCollection.find().toArray()
                res.send(respose)

            } catch (error) {
                res.status(400).send({ message: error.message })
            }
        })


        app.delete("/product/:id", async (req, res) => {
            try {
                const id = req.params.id
                const response = await productCollection.deleteOne({ _id: new ObjectId(id) })
                res.send(response)
            } catch (error) {

                res.status(400).send({ message: error.message })
            }
        })


        app.get("/product/:id", async (req, res) => {
            const id = req.params.id
            try {

                const respose = await productCollection.findOne({ _id: new ObjectId(id) })
                res.send(respose)

            } catch (error) {
                res.status(400).send({ message: error.message })
            }
        })


        app.patch("/product/:id", async (req, res) => {
            const id = req.params.id
            const data = req.body

            const response = await productCollection.updateOne({ _id: new ObjectId(id) }, {
                $set: data
            })

            res.send(response)

        })


        app.post("/wishlist", async (req, res) => {
            const data = req.body

            const wishListData = await wishlistCollection.find({ productID: data.id }).toArray()

            let isExist = false

            for (let item of wishListData) {
                if (item.email == data.email) {
                    isExist = true
                    break
                }
            }


            if (isExist) {
                return res.send({ message: "Product Already In WishList" })
            }
            const newData = {
                productID: data.id,
                email: data.email,
                date: new Date()
            }
            const response = await wishlistCollection.insertOne(newData)
            res.send(response)
        })


        app.get("/wishlist/:email", async (req, res) => {
            const email = req.params.email

            const products = await wishlistCollection.find({ email: email }).toArray()
            let data = []
            for (let product of products) {
                const response = await productCollection.findOne({ _id: new ObjectId(product.productID) })
                data.push({ date: product.date, ...response, email, wishlistId: product?._id })
            }

            res.send(data)
        })


        app.delete("/wishlist/:id", async (req, res) => {
            try {
                const id = req.params.id
                const response = await wishlistCollection.deleteOne({ _id: new ObjectId(id) })
                res.send(response)
            } catch (error) {

                res.status(400).send({ message: error.message })
            }
        })


        app.delete("/wishlist/deleteall/:email", async (req, res) => {

            try {
                const email = req.params.email
                console.log(email);
                const response = await wishlistCollection.deleteMany({ email: email })
                res.send(response)
            } catch (error) {

                res.status(400).send({ message: error.message })
            }
        })



        app.post("/cart" , async (req , res ) => {
            const data = req.body

            const productId = data.productID

            const cartData = await cartCollection.find({productID : productId}).toArray()


            const exist = cartData.find(item => item?.email == data?.email)

            if(exist){
                return res.send({message : "product Alredy In Cart"})
            }

            const response = await cartCollection.insertOne(data)
            res.send(response)
        })  



        app.get("/cart/:email" , async(req , res) => {

            const email = req.params.email
            const response = await cartCollection.find({email : email}).toArray()

         let productResponse = []
           for(let item of response) {
              const productData = await productCollection.findOne({_id : new ObjectId(item.productID)})
              productResponse.push({...productData , cartID : item?._id})
            //   console.log(productData);
           }

           console.log(productResponse);
           console.log(response);

          res.send(productResponse)


            
        })




        app.delete("/cart/:id" , async(req , res) => {
            const id = req.params.id

            const response = await cartCollection.deleteOne({_id : new ObjectId(id)})
            console.log(response);

            res.send(response)
        })









        // app.get("/wishlist/move/:email", async (req, res) => {
        //     const email = req.params.email

        //     const products = await wishlistCollection.find({ email: email }).toArray()
        //     let data = []
        //     for (let product of products) {
                
        //         data.push({ date: new Date(), ...product})
        //     }

        //     console.log(data);


            
        //     const cartData = await cartCollection.find({ productID: data.id }).toArray()

        //    const dataToInsert = []

        //     for (let item of cartData) {
        //         if (item.email !== data.email) {
        //             dataToInsert.push(item)

                    
        //         }
        //     }


        //     if (isExist) {
        //         return res.send({ message: "Product Already In WishList" })
        //     }

        //     // const response = await cartCollection.insertMany(data)

            


        //     // res.send(data)
        // })













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