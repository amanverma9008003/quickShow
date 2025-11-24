import express from "express";
import  protection  from "../middleware/auth.js";
import {isAdmin, getDashboardData, getAllShows, getAllBookings } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.get("/is-admin" ,isAdmin ); //protection,
adminRouter.get("/dashboard", getDashboardData ); //protection,
adminRouter.get("/all-shows", getAllShows ); //protection,
adminRouter.get("/all-bookings", getAllBookings ); //protection,

export default adminRouter;