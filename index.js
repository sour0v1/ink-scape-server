const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// console.log(process.env.DB_USER);

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xhnq0hd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();

    const database = client.db("craftDB");
    const craftCollection = database.collection("craft");

      
    // create craft item
    app.post('/craft', async (req, res) => {
      const newCraft = req.body;
      const result = await craftCollection.insertOne(newCraft);
      res.send(result);
      console.log(newCraft);
    })
    // get added all craft items
    app.get('/craft', async(req, res) =>{
      const cursor = craftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    // delete
    app.delete('/craft/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await craftCollection.deleteOne(query);
      res.send(result);
    })
    /* // get added my craft items
    app.get('/craft/:email', async(req, res) =>{
      const user = req.params.email;
      // console.log(user)
      const query = {loggedUser : user}
      const result = await craftCollection.findOne(user);
      res.send(result);
    }) */

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('inkScape server is running');
})
app.listen(port, () => {
  console.log(`inkServer is running on server is ${port}`)
})