const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
console.log(process.env.DB_PASS);
console.log(process.env.DB_USER);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2xzkprd.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const productCollection = client.db("productDb").collection("mainProduct");
    const cartCollection = client.db("productDb").collection("cardProduct");

    app.get("/product", async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.post("/product", async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });

    app.get("/product/:BrandName", async (req, res) => {
      const cursor = productCollection.find({
        BrandName: req.params.BrandName,
      });
      const result = await cursor.toArray();
      res.send(result);
    });
    //details get

    app.get("/productDetails/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);

      // const BrandName = req.params.BrandName;
      // const query = { brandName: new ObjectId(BrandName) };
      // console.log(query);
      // const result = await productCollection.findOne(query);
      // console.log(result);
      res.send(result);
      // const result = await cursor.toArray();
      // res.send(result);
    });
    app.get("/updateProduct/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      console.log(query);
      const result = await productCollection.findOne(query);
      console.log(result);
      res.send(result);
    });

    //update
    app.put("/updated/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedProduct = req.body;
      const nameProduct = {
        $set: {
          brandName: updatedProduct.brandName,
          name: updatedProduct.name,
          type: updatedProduct.type,
          price: updatedProduct.price,
          rating: updatedProduct.rating,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        nameProduct,
        options
      );
      res.send(result);
    });

    //add to cart

    app.post("/cartProduct", async (req, res) => {
      const product = req.body;
      console.log(product);
      const result = await cartCollection.insertOne(product);
      res.send(result);
    });
    //cart
    app.get("/CartCollect", async (req, res) => {
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    //delete
    app.delete("/CartCollect/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("entertainment media is running");
});

app.listen(port, () => {
  console.log(`entertainment server is running on port:${port}`);
});
