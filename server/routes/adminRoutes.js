import express from "express";
import  protection  from "../middleware/auth.js";
import {isAdmin, getDashboardData, getAllShows, getAllBookings } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.get("/is-admin",protection,isAdmin ); //protection,
adminRouter.get("/dashboard",protection, getDashboardData ); //protection,
adminRouter.get("/all-shows", protection,getAllShows ); //protection,
adminRouter.get("/all-bookings",protection, getAllBookings ); //protection,

export default adminRouter;