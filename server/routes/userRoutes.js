import express from 'express';
import { getUserBookings, addFavourite,getFavourites } from '../controllers/userController.js';
import { clerkMiddleware } from '@clerk/express';
const userRouter = express.Router();

userRouter.use(clerkMiddleware());
userRouter.get('/bookings', getUserBookings);
userRouter.post('/update-favourite', addFavourite);
userRouter.get('/favourites', getFavourites);

export default userRouter;