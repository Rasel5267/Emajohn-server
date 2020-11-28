const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zsf87.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 4000;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const productsCollection = client.db("emaJohn").collection("products");
  const ordersCollection = client.db("emaJohn").collection("orders");
  
    app.post('/addProduct', (req, res) => {
      console.log()
        const products = req.body;
        productsCollection.insertMany(products)
        .then(result => {
            console.log(result.insertedCount);
            res.send(result.insertedCount)
        })
    })

    app.get('/products', (req, res) => {
        productsCollection.find({})
        .toArray( (err, documents) => {
            res.send(documents);
        })
    })

    app.get('/product/:key', (req, res) => {
        productsCollection.find({key: req.params.key})
        .toArray( (err, documents) => {
            res.send(documents[0]);
        })
    })

    app.post('/productsByKeys', (req, res) => {
        const productKeys = req.body;
        productsCollection.find({key: { $in: productKeys} })
        .toArray( (err, documents) => {
            res.send(documents);
        })
    })

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })
});

app.get('/', (req, res) => {
  res.send('Database connected')
})

app.listen(port);