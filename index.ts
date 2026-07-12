import express, { Request, Response, NextFunction } from 'express'
const app = express()
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
const port = process.env.PORT
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import { createRemoteJWKSet, jwtVerify } from 'jose-cjs'
const uri = process.env.MONGODB_URI as string

app.use(cors())
app.use(express.json())

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const JWKS = createRemoteJWKSet(
  new URL(`${process.env.CLIENT_URL}/api/auth/jwks`)
)

const verifyToken = async(req: Request, res: Response, next: NextFunction)=>{
  const authHeader = req?.headers.authorization
  if (!authHeader) {
    return res.status(401).json({message: 'Unauthorized'})
  }
  const token = authHeader.split(" ")[1]
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" })
  }
  try{
    const {payload} = await jwtVerify(token, JWKS)
    console.log(payload);
    next()
  }catch (error) {
    return res.status(403).json({ message: "Forbidden" })
  }
}

async function run() {
  try {
    //await client.connect();
    const db = client.db("wanderlust");
    const destinationCollection = db.collection("destination");
    const bookingCollection = db.collection("bookings");

    // ─── DESTINATIONS ───────────────────────────────────────────────

    app.post('/destination', verifyToken, async(req: Request, res: Response)=>{
      const destinationData = req.body
      const result = await destinationCollection.insertOne(destinationData)
      res.send(result)
    })

    app.get('/destination', async(req: Request, res: Response)=>{
      const result = await destinationCollection.find().toArray()
      res.send(result)
    })

    app.get('/featured', async(req: Request, res: Response)=>{
      const result = await destinationCollection.find().limit(10).toArray()
      res.send(result)
    })

    app.get('/destination/:id', verifyToken, async(req: Request, res: Response)=>{
      const id = req.params.id as string
      const query = { _id: new ObjectId(id) }
      const result = await destinationCollection.findOne(query)
      res.send(result)
    })

    app.patch('/destination/:id', verifyToken, async(req: Request, res: Response)=>{
      const id = req.params.id as string
      const query = { _id: new ObjectId(id) }
      const update = req.body
      const updated = { $set: { ...update } }
      const result = await destinationCollection.updateOne(query, updated)
      res.send(result)
    })

    app.delete('/destination/:id', verifyToken, async(req: Request, res: Response)=>{
      const id = req.params.id as string
      const query = { _id: new ObjectId(id) }
      const result = await destinationCollection.deleteOne(query)
      res.send(result)
    })

    // ─── BOOKINGS 
    app.post('/bookings', verifyToken, async(req: Request, res: Response)=>{
      const bookings = req.body
      const result = await bookingCollection.insertOne(bookings)
      res.send(result)
    })

    // Get bookings for a specific user
    app.get('/bookings/:userId', verifyToken, async(req: Request, res: Response)=>{
      const userId = req.params.userId
      const query = { userId: userId }
      const result = await bookingCollection.find(query).toArray()
      res.send(result)
    })

    app.delete('/bookings/:id', verifyToken, async(req: Request, res: Response)=>{
      const id = req.params.id as string
      const query = { _id: new ObjectId(id) }
      const result = await bookingCollection.deleteOne(query)
      res.send(result)
    })

    //ADMIN ROUTES 
    app.get('/admin/bookings', verifyToken, async(req: Request, res: Response)=>{
      const result = await bookingCollection.find().toArray()
      res.send(result)
    })

    // Get platform stats for admin dashboard
    app.get('/admin/stats', verifyToken, async(req: Request, res: Response)=>{
      const [totalDestinations, totalBookings] = await Promise.all([
        destinationCollection.countDocuments(),
        bookingCollection.countDocuments(),
      ])
      const revenueAgg = await bookingCollection.aggregate([
        { $group: { _id: null, total: { $sum: { $toDouble: '$price' } } } }
      ]).toArray()
      const totalRevenue = revenueAgg[0]?.total || 0

      res.send({ totalDestinations, totalBookings, totalRevenue })
    })

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // keep connection alive
  }
}
run().catch(console.dir);

app.get('/', (req: Request, res: Response)=>{
  res.send('elevate-journey server is running')
})

app.listen(port, ()=>{
  console.log(`server is running on port http://localhost:${port}`)
})
