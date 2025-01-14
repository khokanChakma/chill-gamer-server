require('dotenv').config()
const express = require('express');
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const cors = require('cors');

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tv5k8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // const gymShedule = client.db('gym-shedule').collection('shedule');
    const userCollection = client.db('gaming-user').collection('users');
    const reviewCollection = client.db('gaming-user').collection('reviews');
    const watchListCollection = client.db('gaming-user').collection('watchList');

    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    app.post('/users', async (req, res) => {
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    })
    app.get('/users', async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // watchList related api

    app.post('/watchList', async (req, res) => {
      const newWatchList = req.body;
      const result = await watchListCollection.insertOne(newWatchList);
      res.send(result);
    })

    app.get('/watchList', async (req, res) => {
      const cursor = watchListCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // review related api

    app.post('/reviews', async (req, res) => {
      const newReview = req.body;
      const result = await reviewCollection.insertOne(newReview);
      res.send(result);
    })

    app.get('/reviews', async (req, res) => {
      const cursor = reviewCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/review/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await reviewCollection.findOne(query);
      res.send(result);
    })

    app.get('/reviewData', async(req,res) =>{
      const reviews = reviewCollection.find().sort({rating:"-1"}).limit(6)
      const result = await reviews.toArray()
      res.send(result)
    })

    app.patch('/reviews/:id', async(req,res)=>{
      const id = req.params.id;
      const data = req.body;
      const query = {_id: new ObjectId(id)};
      const update = {
        $set: {
          coverImage: data?.coverImage,
          title: data?.title,
          review: data?.review,
          rating: data?.rating,
          year: data?.year,
          genres: data?.genres,
          email: data?.email,
          name: data?.name
          
        }
      }
      const result = await reviewCollection.updateOne(query,update);
      res.send(result);

    })

    app.delete('/reviews/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await reviewCollection.deleteOne(query);
      res.send(result);
    })

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
  res.send('gamer server is ready')
})
app.listen(port, () => {
  console.log(`gaming is getting is the port ${port}`)
})