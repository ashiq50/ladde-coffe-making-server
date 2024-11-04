const express = require("express")
const cors = require("cors")
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e0jfh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)
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

    const database = client.db("marvellous-coffee");
    const coffeeCollection = database.collection("coffee");
     // get operation
     app.get('/coffee', async(req, res)=>{
          const cursor = coffeeCollection.find()
          const result = await cursor.toArray()
          res.send(result)
     })
     // find operation
     app.get('/coffee/:id', async(req, res)=>{
          const id = req.params.id;
          const query = {_id: new ObjectId(id)}
          const result = await coffeeCollection.findOne(query);
          res.send(result)
     })
     // put or patch
     app.put("/coffee/:id", async(req, res)=>{
          const id = req.params.id;
          const filter = {_id: new ObjectId(id)}
          const options = { upsert: true };
          const updatedCoffee = req.body;
          const coffee = {
               $set:{
                    name:updatedCoffee.name,
                    supplier:updatedCoffee.supplier,
                    category:updatedCoffee.category,
                    taste:updatedCoffee.taste,
                    chef:updatedCoffee.chef,
                    details:updatedCoffee.details,
                    photo:updatedCoffee.name
               }
          }
          const result = await coffeeCollection.updateOne(filter, coffee, options);
          res.send(result)
     })
     // post operation
     app.post("/coffee", async(req, res)=>{
          const newCoffee = req.body;
          const result = await coffeeCollection.insertOne(newCoffee);
          res.send(result)
     })
     // Delete operation
     app.delete('/coffee/:id', async(req, res)=>{
          const id = req.params.id;
          const query = {_id: new ObjectId(id)}
          const result = await coffeeCollection.deleteOne(query)
          res.send(result)
     })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
//     await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
     res.send("coffee making server is running now")
})

app.listen(port, ()=>{
     console.log(`coffee making server is running on port: ${port}`)
})

