const express = require('express')
const { MongoClient } = require('mongodb');
const app = express()
const ObjectId=require(`mongodb`).ObjectId
var cors = require('cors')
require('dotenv').config()
const port =process.env.PORT || 5000

app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.amixw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
      await client.connect();
      const database = client.db("MoriiTravel");
      const Services = database.collection("services");
      const orders = database.collection("orders");


    //   services get api
   app.get(`/services`,async(req,res)=>{
       const cursor=Services.find({})
       const result=await cursor.toArray()
       res.json(result)
   })

//    services post
   app.post(`/services`,async(req,res)=>{
       const newService=req.body;
       const result=await Services.insertOne(newService)
       res.json(result)
   })

//    specific services id get
   app.get(`/services/:id`,async(req,res)=>{
       const id=req.params.id;
       const quary={_id:ObjectId(id)}
       const result=await Services.findOne(quary)
       res.json(result)
   })
  
//    orders post
   app.post(`/orders`,async(req,res)=>{
       const newOrder=req.body;
       const result=await orders.insertOne(newOrder)
       res.json(result)
   })
//    orders get
   app.get(`/orders`,async(req,res)=>{
       const cursor=orders.find({})
       const result=await cursor.toArray()
       res.json(result)
   })

//    specific orders id get
   app.get(`/orders/:email`,async(req,res)=>{
       const cursor=orders.find({email:req.params.email})
       const result=await cursor.toArray()
       res.send(result)
   })

//    specific orders id delete
    app.delete(`/orders/:id`,async(req,res)=>{
       const id=req.params.id;
       const quary={_id:ObjectId(id)}
       const result=await orders.deleteOne(quary)
       res.json(result)
        
    })

    // specific orders id update
        app.put(`/orders/:id`,async(req,res)=>{
           const id=req.params.id;
           const quary={_id:ObjectId(id)}
           const options = { upsert: true };
           const updateDoc = {
            $set: {
               status:'approved'
            },
          }; 
          const result=await orders.updateOne(quary,updateDoc,options)
          console.log(result);
           res.json(result)
        })


    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

  
app.get('/', (req, res) => {
  res.send('morii travel server start with amanullah nirub,alhamdolillah')
})

app.listen(port, () => {
  console.log(`morri travel server start alhamdolillah`,port)
})