import express, { Request, Response, NextFunction } from 'express'
const app = express()
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
const port = process.env.PORT



app.use(cors())
app.use(express.json())



async function run() {
 try{

 }
  
  finally {
    // keep connection alive
  }
}
run().catch(console.dir);

app.get('/', (req: Request, res: Response)=>{
  res.send('Wanderlust server is running')
})

app.listen(port, ()=>{
  console.log(`server is running on port http://localhost:${port}`)
})
