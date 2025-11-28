import express from 'express';
import cors from 'cors';
import "dotenv/config";
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express';
import { serve } from 'inngest/express';
import {inngest, functions} from "./inngest/index.js"
import showRouter from './routes/showRoutes.js';
import userRouter from './routes/userRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import { stripeWebhooks } from './controllers/stripeWebhooks.js';

const app = express();
const port = 3000;
await connectDB();

// Stripe webhook route (must be before express.json())
app.use('/api/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

// General middlewares
app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

app.use(cors());

// Clerk middleware (must be after general middlewares, before protected routes)
app.use(clerkMiddleware());


// Routes
app.get('/', (req, res) => { res.send('Hello World'); });
app.use('/api/inngest', serve({ client: inngest, functions }));
app.use('/api/show', showRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});

//mongodb+srv://admin:admin@cluster0.pvpu06g.mongodb.net/?appName=Cluster0