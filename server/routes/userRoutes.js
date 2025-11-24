import express from 'express';
import { getUserBookings, addFavourite,getFavourites } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/bookings',getUserBookings);
userRouter.post('/update-favourite', addFavourite);
userRouter.get('/favourites', getFavourites);

export default userRouter;