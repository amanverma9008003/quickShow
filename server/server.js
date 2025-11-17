import express from 'express';
import cors from 'cors';
import "dotenv/config";
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express';
import { serve } from 'inngest/express';
import {inngest, functions} from "./inngest/index.js"
const app=express();
const port=3000;
await connectDB();
//Middlewares

app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())

//Routes

app.get('/',(req,res)=>{
    res.send('Hello World')
})
app.use('/api/inngest',serve({ client: inngest, functions }))

app.listen(port,()=>{
    console.log(`Server is running on port http://localhost:${port}`)
})

//mongodb+srv://admin:admin@cluster0.pvpu06g.mongodb.net/?appName=Cluster0